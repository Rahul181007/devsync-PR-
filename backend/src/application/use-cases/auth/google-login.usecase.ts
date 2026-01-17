import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IGoogleAuthService } from "../../../domain/service/google-auth.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { Tokenutilits } from "../../../shared/utils/token.util";
import { LoginResponseDTO } from "../../dto/auth/login.response.dto";

export class GoogleLoginUseCase {
    constructor(
        private _userRepo:IUserRepository,
        private _companyRepo:ICompanyRepository,
        private _googleAuthservice:IGoogleAuthService
    ){}

    async execute(idToken:string):Promise<LoginResponseDTO>{
        const googleUser=await this._googleAuthservice.verifyIdToken(idToken);
        if(!googleUser.emailVerified){
            throw new AppError(RESPONSE_MESSAGES.AUTH.EMAIL_NOT_VERIFIED,HttpStatus.UNAUTHORIZED)
        }

        const user=await this._userRepo.findByEmail(googleUser.email);
        if(!user){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(user.authProvider!=='GOOGLE'){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.USE_PASSWORD_LOGIN,
                HttpStatus.BAD_REQUEST
            )
        }

        if(user.status==='PENDING_VERIFICATION'){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.OTP_NOT_VERIFIED,
                HttpStatus.FORBIDDEN
            )
        }


        if(!user.companyId){
            const accessToken=Tokenutilits.generateAccessToken({
                sub:user.id,
                role:user.role,
                companyId:null,
                onboarding:true
            })
           const refreshToken=Tokenutilits.generateRefreshToken({
            sub:user.id,
            role:user.role,
           })

           await this._userRepo.updateLastLogin(user.id,new Date());

           return {
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            companyId:null,
            requiresOnboarding:true,
            onboardingStep:'WORKSPACE',
            accessToken,
            refreshToken
           }
        }

        const company=await this._companyRepo.findById(user.companyId);
        if(!company){
            throw new AppError(RESPONSE_MESSAGES.AUTH.COMPANY_NOT_FOUND,HttpStatus.FORBIDDEN)
        }

        if(company.onboardingStep!=='DONE'){
            const accessToken=Tokenutilits.generateAccessToken({
                sub:user.id,
                role:user.role,
                companyId:user.companyId,
                onboarding:true
            })
            const refreshToken=Tokenutilits.generateRefreshToken({
                sub:user.id,
                role:user.role
            })
            await this._userRepo.updateLastLogin(user.id,new Date());
            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                companyId:user.companyId,
                requiresOnboarding:true,
                onboardingStep:company.onboardingStep,
                accessToken,
                refreshToken

            }
        }
        if(company.status!=='APPROVED'){
            const accessToken=Tokenutilits.generateAccessToken({
                sub:user.id,
                role:user.role,
                companyId:user.companyId,
                onboarding:false
            })
            const refreshToken=Tokenutilits.generateRefreshToken({
                sub:user.id,
                role:user.role
            })

            await this._userRepo.updateLastLogin(user.id,new Date());

            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                companyId:user.companyId,
                waitingForApproval:true,
                onboardingStep:'DONE',
                accessToken,
                refreshToken
            }
        }

        await this._userRepo.updateLastLogin(user.id,new Date());

        const accessToken=Tokenutilits.generateAccessToken({
            sub:user.id,
            role:user.role,
            companyId:user.companyId
        })
        const refreshToken=Tokenutilits.generateRefreshToken({
            sub:user.id,
            role:user.role
        })

        return {
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            companyId:user.companyId,
            companySlug:company.slug,
            onboardingStep:'DONE',
            accessToken,
            refreshToken
        }
    }
}