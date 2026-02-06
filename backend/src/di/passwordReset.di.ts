import { PasswordResetRepository } from "../infrastructure/repositories/passwordReset.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { SendOtpUseCase } from "../application/use-cases/auth/sendOtp.usecase";
import { VerifyOtpUseCase } from "../application/use-cases/auth/verifyOtp.usecase";
import { ResetPasswordUSeCase } from "../application/use-cases/auth/resetPassword.usecase";

import { PasswordResetController } from "../interfaces/controllers/passwordReset.controller";
import { NodemailerService } from "../infrastructure/services/mail/nodemailer.service";
import { ISendOtpUseCase } from "../application/interface/auth/ISendOtpUseCase";
import { IVerifyOtpUseCase } from "../application/interface/auth/IVerifyOtpUseCase";
import { IResetPasswordUseCase } from "../application/interface/auth/IResetPasswordUseCase";


const passwordResetRepo=new PasswordResetRepository();
const userRepo=new UserRepository();
const mailService=new NodemailerService();

//usecasew
const sendOtpUseCase:ISendOtpUseCase=new SendOtpUseCase(userRepo,passwordResetRepo,mailService);
const verifyOtpUseCase:IVerifyOtpUseCase=new VerifyOtpUseCase(passwordResetRepo);
const  resetPasswordUseCase:IResetPasswordUseCase=new ResetPasswordUSeCase(userRepo,passwordResetRepo);

//controller
export const passwordResetController=new PasswordResetController(
    sendOtpUseCase,
    verifyOtpUseCase,
    resetPasswordUseCase
) 