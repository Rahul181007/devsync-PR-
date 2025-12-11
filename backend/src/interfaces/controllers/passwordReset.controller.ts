import { Request,Response } from "express";
import { SendOtpUseCase } from "../../application/use-cases/auth/sendOtp.usecase";
import { VerifyOtpUseCase } from "../../application/use-cases/auth/verifyOtp.usecase";
import { ResetPasswordUSeCase } from "../../application/use-cases/auth/resetPassword.usecase";

export class PasswordResetController{
    constructor(
        private sendOtpUseCase:SendOtpUseCase,
        private verifyOtpUseCase:VerifyOtpUseCase,
        private resetPasswordUseCase:ResetPasswordUSeCase
    ){}

    sendOtp=async(req:Request,res:Response)=>{
        try {
            const {email}=req.body;

            const response=await this.sendOtpUseCase.execute(email);
            return res.json(response)
        } catch (error:any) {
             return res.status(400).json({ error: error.message });
        }
    }

    verifyOtp=async(req:Request,res:Response)=>{
        try {
            const {email,otp}=req.body;

            const response=await this.verifyOtpUseCase.execute(email,otp);
            return res.json(response)
        } catch (error:any) {
             return res.status(400).json({ error: error.message });
        }
        
    }

    resetPassword=async(req:Request,res:Response)=>{
        try {
            const {email,newPassword}=req.body;
   
            const response=await this.resetPasswordUseCase.excute(email,newPassword);
            return res.json(response)
        } catch (error:any) {
            return res.status(400).json({ error: error.message });
        }
    }
}