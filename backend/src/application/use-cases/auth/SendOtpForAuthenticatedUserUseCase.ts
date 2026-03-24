import { IPasswordResetRepository } from "../../../domain/repositories/passwordReset.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IMailService } from "../../../domain/service/mail.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { ISendOtpForAuthenticatedUserUseCase } from "../../interface/auth/ISendOtpForAuthenticatedUserUseCase";
import crypto from "crypto";
export class SendOtpForAuthenticatedUserUseCase implements ISendOtpForAuthenticatedUserUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _superAdminRepo:ISuperAdminRepository,
        private _passwordRepo: IPasswordResetRepository,
        private _mailService: IMailService
    ){}

    async execute(userId: string): Promise<{ message: string; }> {
        let email:string;

        const user=await this._userRepo.findById(userId);
        if(user){
            email=user.email;

        }else{
            const superAdmin=await this._superAdminRepo.findById(userId);
            if(!superAdmin){
              throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
            }
            email=superAdmin.email;
        }

        const otp=crypto.randomInt(100000,999999).toString();

        const expiresAt=new Date(Date.now()+5*60*1000);

        await this._passwordRepo.deleteByEmail(email);

        await this._passwordRepo.create({
            email,
            otp,
            expiresAt
        })

        await this._mailService.sendOtp(email,otp);
        console.log(`OTP for ${email}: ${otp}`);
         return { message: RESPONSE_MESSAGES.AUTH.OTP_SENT_SUCCESS };
    }

    
}