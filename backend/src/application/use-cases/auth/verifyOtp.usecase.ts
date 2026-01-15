import { IPasswordResetRepository } from "../../../domain/repositories/passwordReset.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class VerifyOtpUseCase{
    constructor(private _passwordResetRepo:IPasswordResetRepository){}

    async execute(email:string,otp:string){
        console.log(email,otp)
        const record=await this._passwordResetRepo.findValidOtp(email,otp)
        if(!record){
            throw new AppError(RESPONSE_MESSAGES.AUTH.INVALID_OTP,HttpStatus.BAD_REQUEST)
        }

        return {message:RESPONSE_MESSAGES.AUTH.OTP_VERIFIED}
    }
}