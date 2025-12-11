import { IPasswordResetRepository } from "../../../domain/repositories/passwordReset.repository";

export class VerifyOtpUseCase{
    constructor(private passwordResetRepo:IPasswordResetRepository){}

    async execute(email:string,otp:string){
        console.log(email,otp)
        const record=await this.passwordResetRepo.findValidOtp(email,otp)
        if(!record){
            throw new Error(' Invalid or expired Otp')
        }

        return {message:'OTP verified'}
    }
}