import { UserRepository } from "../infrastructure/repositories/user.repository";
import { LoginUserUseCase } from "../application/use-cases/auth/loginUser.usecase";
import { UserAuthController } from "../interfaces/controllers/userAuth.controller";
import { refreshTokenUseCase } from "./authRefresh.di";
import { BcryptPasswordHasher } from "../infrastructure/security/bcryptPasswordHasher";
import { SignupUseCase } from "../application/use-cases/auth/signup.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { GoogleSignupUseCase } from "../application/use-cases/auth/google-signup.usecase";
import { VerifySignupOtpUseCase } from "../application/use-cases/auth/verify-signup-otp.usecase";
import { GoogleAuthService } from "../infrastructure/security/google-auth.service";
import { GoogleLoginUseCase } from "../application/use-cases/auth/google-login.usecase";
import { NodemailerService } from "../infrastructure/services/mail/nodemailer.service";
import { IGoogleLoginUseCase } from "../application/interface/auth/IGoogleLoginUseCase";
import { IGoogleSignupUseCase } from "../application/interface/auth/IGoogleSignupUseCase";
import { ILoginUserUseCase } from "../application/interface/auth/ILoginUserUseCase";
import { ISignupUseCase } from "../application/interface/auth/ISignupUseCase";
import { IVerifySignupOtpUseCase } from "../application/interface/auth/IVerifySignupOtpUseCase";
import { IResendSignupOtpUseCase } from "../application/interface/auth/IResendSignupOtpUseCase";
import { ResendSignupOtpUseCase } from "../application/use-cases/auth/ResendSignupOtpUseCase";
import { ICheckUserStatusUseCase } from "../application/interface/user/ICheckUserStatusUseCase";
import { CheckUserStatusUseCase } from "../application/use-cases/user/checkUserStatus.usecase";
import { SuperAdminRepository } from "../infrastructure/repositories/superAdmin.repository";
const userRepository=new UserRepository();
const companyRepository=new CompanyRepository();
const passwordHasher=new BcryptPasswordHasher();
const googleAuthService=new GoogleAuthService();
const emailService=new NodemailerService();
const superAdminRepository=new SuperAdminRepository()
const googleSignupUseCase:IGoogleSignupUseCase=new GoogleSignupUseCase(userRepository,googleAuthService,emailService);
const verifySignupOtpUseCase:IVerifySignupOtpUseCase=new VerifySignupOtpUseCase(userRepository)
const loginUserUseCase:ILoginUserUseCase=new LoginUserUseCase(userRepository,passwordHasher,companyRepository);
const signupUseCase:ISignupUseCase=new SignupUseCase(userRepository,passwordHasher,emailService)
const googleLoginUseCase:IGoogleLoginUseCase=new GoogleLoginUseCase(userRepository,companyRepository,googleAuthService);
const resendSignupOtpUseCase:IResendSignupOtpUseCase=new ResendSignupOtpUseCase(userRepository,emailService)
export const checkUserStatusUseCase:ICheckUserStatusUseCase=new CheckUserStatusUseCase(userRepository,superAdminRepository)
export const userAuthController=new UserAuthController(loginUserUseCase,refreshTokenUseCase,signupUseCase,googleSignupUseCase,verifySignupOtpUseCase,googleLoginUseCase,resendSignupOtpUseCase)