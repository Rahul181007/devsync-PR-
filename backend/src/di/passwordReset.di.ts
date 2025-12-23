import { PasswordResetRepository } from "../infrastructure/repositories/passwordReset.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { SendOtpUseCase } from "../application/use-cases/auth/sendOtp.usecase";
import { VerifyOtpUseCase } from "../application/use-cases/auth/verifyOtp.usecase";
import { ResetPasswordUSeCase } from "../application/use-cases/auth/resetPassword.usecase";

import { PasswordResetController } from "../interfaces/controllers/passwordReset.controller";
import { NodemailerService } from "../infrastructure/services/mail/nodemailer.service";


const passwordResetRepo=new PasswordResetRepository();
const userRepo=new UserRepository();
const mailService=new NodemailerService();

//usecasew
const sendOtpUseCase=new SendOtpUseCase(userRepo,passwordResetRepo,mailService);
const verifyOtpUseCase=new VerifyOtpUseCase(passwordResetRepo);
const  resetPasswordUseCase=new ResetPasswordUSeCase(userRepo,passwordResetRepo);

//controller
export const passwordResetController=new PasswordResetController(
    sendOtpUseCase,
    verifyOtpUseCase,
    resetPasswordUseCase
) 