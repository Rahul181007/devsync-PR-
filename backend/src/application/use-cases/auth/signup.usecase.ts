import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IMailService } from "../../../domain/service/mail.service";
import { IPasswordHasher } from "../../../domain/service/password-hasher";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { SignupDTO } from "../../dto/auth/signup.dto";

export class SignupUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _passwordHasher:IPasswordHasher,
        private _emailService:IMailService
    ){}

    async execute(data:SignupDTO):Promise<{email:string}>{
        const user=await this._userRepo.findByEmail(data.email);

        if(user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.USER_ALREADY_EXISTS,HttpStatus.CONFLICT)
        }

        const passwordHash=await this._passwordHasher.hash(data.password);
             const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
       await this._userRepo.create({
        name:data.name,
        email:data.email,
        passwordHash:passwordHash,
        role:'COMPANY_ADMIN',
        authProvider:'LOCAL',
        status:'PENDING_VERIFICATION',
        companyId:null,
        otp,
        otpExpiresAt
       })
       await this._emailService.sendSignupOtp(data.email,otp)

       return {
        email:data.email
       }
    }
}