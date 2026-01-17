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
const userRepository=new UserRepository();
const companyRepository=new CompanyRepository();
const passwordHasher=new BcryptPasswordHasher();
const googleAuthService=new GoogleAuthService();
const emailService=new NodemailerService()
 const googleSignupUseCase=new GoogleSignupUseCase(userRepository,googleAuthService,emailService);
 const verifySignupOtpUseCase=new VerifySignupOtpUseCase(userRepository)

const loginUserUseCase=new LoginUserUseCase(userRepository,passwordHasher,companyRepository);
const signupUseCase=new SignupUseCase(userRepository,passwordHasher,emailService)
const googleLoginUseCase=new GoogleLoginUseCase(userRepository,companyRepository,googleAuthService)
export const userAuthController=new UserAuthController(loginUserUseCase,refreshTokenUseCase,signupUseCase,googleSignupUseCase,verifySignupOtpUseCase,googleLoginUseCase)