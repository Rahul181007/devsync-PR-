import { IUserRepository } from '../../../domain/repositories/user.repository'
import { LoginDTO } from '../../dto/auth/login.dto'
import { LoginResponseDTO } from '../../dto/auth/login.response.dto'
import { Tokenutilits } from '../../../shared/utils/token.util';
import { IPasswordHasher } from '../../../domain/service/password-hasher';
import { AppError } from '../../../shared/errors/AppError';
import { RESPONSE_MESSAGES } from '../../../shared/constants/responseMessages';
import { HttpStatus } from '../../../shared/constants/httpStatus';
import { ICompanyRepository } from '../../../domain/repositories/company.repository';

export class LoginUserUseCase{
    constructor(
        private userRepo:IUserRepository,
        private passwordHasher:IPasswordHasher,
        private companyRepo:ICompanyRepository
    ){}
   
    async execute(data:LoginDTO):Promise<LoginResponseDTO>{

        const user=await this.userRepo.findByEmail(data.email);
       
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS,HttpStatus.UNAUTHORIZED);
        }

        // check password
        const isValid=await this.passwordHasher.compare(data.password,user.passwordHash);
        if(!isValid){
            throw new AppError(RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS,HttpStatus.UNAUTHORIZED);
        }
        // only allowed roles like company admin and developer
         if(user.role!=='COMPANY_ADMIN' && user.role!=='DEVELOPER'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.INVALID_ROLE,HttpStatus.FORBIDDEN);
        }

        if (user.status==='BLOCKED'){
          throw new AppError(RESPONSE_MESSAGES.AUTH.USER_BLOCKED,HttpStatus.FORBIDDEN);
        }
        
        // Onboarding not completed
        if(user.status==='PENDING_ONBOARDING'){
            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                requiresOnboarding:true
            }
        }

        if(user.role==='COMPANY_ADMIN'){
           if(!user.companyId){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.COMPANY_NOT_FOUND,
                HttpStatus.FORBIDDEN
            )
           }
           const company=await this.companyRepo.findById(user.companyId);

           if(!company){
            throw new AppError(RESPONSE_MESSAGES.AUTH.COMPANY_NOT_FOUND,HttpStatus.FORBIDDEN)
           }

           if(company.status!=='APPROVED'){
            return {
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role,
                waitingForApproval:true
            }
           }
        }
       

       

        // update last login
         await this.userRepo.updateLastLogin(user.id, new Date());
        
        // create token payload 
        const payload={
            sub:user.id,
            role:user.role,
            companyId:user.companyId
        }

        const accessToken=Tokenutilits.generateAccessToken(payload);
        const refreshToken=Tokenutilits.generateRefreshToken({sub:user.id,role:user.role});


        return {
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            accessToken,
            refreshToken
        }
    }

}