import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class VerifySignupOtpUseCase {
    constructor(
      private _userRepo:IUserRepository
    ){}
    async execute(email:string,otp:string):Promise<void>{
        const user=await this._userRepo.findByEmail(email);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }

        if(user.status!=='PENDING_VERIFICATION'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.OTP_ALREADY_VERIFIED,HttpStatus.BAD_REQUEST)
        }
        if(!user.otp||!user.otpExpiresAt){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.INVALID_OTP,
                HttpStatus.BAD_REQUEST
            )
        }
        if(user.otp!==otp){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.INVALID_OTP,
                HttpStatus.BAD_REQUEST
            )
        }
        if(user.otpExpiresAt<new Date()){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.OTP_EXPIRED,
                HttpStatus.BAD_REQUEST
            )
        }

        await this._userRepo.updateStatus(user.id,'PENDING_ONBOARDING');

        await this._userRepo.updateOtp(user.id,null,null)
    }

}
