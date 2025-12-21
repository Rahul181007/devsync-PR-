import { Request,Response } from "express";
import { SendOtpUseCase } from "../../application/use-cases/auth/sendOtp.usecase";
import { VerifyOtpUseCase } from "../../application/use-cases/auth/verifyOtp.usecase";
import { ResetPasswordUSeCase } from "../../application/use-cases/auth/resetPassword.usecase";
import { logger } from "../../shared/logger/logger";
import { handleError } from "../../shared/utils/handleError";

export class PasswordResetController{
    constructor(
        private sendOtpUseCase:SendOtpUseCase,
        private verifyOtpUseCase:VerifyOtpUseCase,
        private resetPasswordUseCase:ResetPasswordUSeCase
    ){}

    sendOtp=async(req:Request,res:Response)=>{
        try {
            logger.info(`send otp requesterd to ${req.body.email}`)
            const {email}=req.body;

            const response=await this.sendOtpUseCase.execute(email);
            logger.info('otp sendede successfully')
            return res.json(response)
            
        } catch (error:unknown) {
            return handleError(error,res,400,'Send otp failed')
        }
    }

    verifyOtp=async(req:Request,res:Response)=>{
        try {
            const {email,otp}=req.body;

            const response=await this.verifyOtpUseCase.execute(email,otp);
            logger.info('otp verification is successful')
            return res.json(response)
        } catch (error:unknown) {
            return handleError(error,res,400,'verify otp failed')
        }
        
    }

    resetPassword=async(req:Request,res:Response)=>{
        try {
            const {email,newPassword}=req.body;
   
            const response=await this.resetPasswordUseCase.excute(email,newPassword);
            logger.info('reser password was successful')
            return res.json(response)
        } catch (error:unknown) {
            logger.error('reset password was failed',error)
            return handleError(error,res,400,'Reset password failed')
        }
    }
}