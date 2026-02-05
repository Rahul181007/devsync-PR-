import { Request,Response } from "express";
import { logger } from "../../shared/logger/logger";
import { handleError } from "../../shared/utils/handleError";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { ISendOtpUseCase } from "../../application/interface/auth/ISendOtpUseCase";
import { IVerifyOtpUseCase } from "../../application/interface/auth/IVerifyOtpUseCase";
import { IResetPasswordUseCase } from "../../application/interface/auth/IResetPasswordUseCase";

export class PasswordResetController{
    constructor(
        private _sendOtpUseCase:ISendOtpUseCase,
        private _verifyOtpUseCase:IVerifyOtpUseCase,
        private _resetPasswordUseCase:IResetPasswordUseCase
    ){}

    sendOtp=async(req:Request,res:Response)=>{
        try {
            logger.info(`send otp requesterd to ${req.body.email}`)
            const {email}=req.body;

            const response=await this._sendOtpUseCase.execute(email);
            logger.info('otp sendede successfully')
            return res.status(HttpStatus.OK).json(response)
            
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    verifyOtp=async(req:Request,res:Response)=>{
        try {
            const {email,otp}=req.body;

            const response=await this._verifyOtpUseCase.execute(email,otp);
            logger.info('otp verification is successful')
            return res.status(HttpStatus.OK).json(response)
        } catch (error:unknown) {
            return handleError(error,res)
        }
        
    }

    resetPassword=async(req:Request,res:Response)=>{
        try {
            const {email,newPassword}=req.body;
   
            const response=await this._resetPasswordUseCase.execute(email,newPassword);
            logger.info('reser password was successful')
            return res.status(HttpStatus.OK).json(response)
        } catch (error:unknown) {
            logger.error('reset password was failed',error)
            return handleError(error,res)
        }
    }
}