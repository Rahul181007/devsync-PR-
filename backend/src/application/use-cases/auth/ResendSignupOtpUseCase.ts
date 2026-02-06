import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IMailService } from "../../../domain/service/mail.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class ResendSignupOtpUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _emailService:IMailService
    ){}

    async execute(email:string):Promise<void>{
        const user=await this._userRepo.findByEmail(email);
        
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
         if(user.status!=="PENDING_VERIFICATION"){
            throw new AppError(RESPONSE_MESSAGES.AUTH.USER_ALREADY_VERIFIED,HttpStatus.BAD_REQUEST)
         }

         const otp =Math.floor(100000+Math.random()*900000).toString();
         const otpExpiredAt=new Date(Date.now()+10*60*1000);
         await this._userRepo.updateOtp(user.id,otp,otpExpiredAt);
         await this._emailService.sendSignupOtp(email,otp)
    }
}