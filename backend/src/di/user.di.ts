import { UserRepository } from "../infrastructure/repositories/user.repository";
import { LoginUserUseCase } from "../application/use-cases/auth/loginUser.usecase";
import { UserAuthController } from "../interfaces/controllers/userAuth.controller";
import { refreshTokenUseCase } from "./authRefresh.di";
import { BcryptPasswordHasher } from "../infrastructure/security/bcryptPasswordHasher";
import { SignupUseCase } from "../application/use-cases/auth/signup.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
const userRepository=new UserRepository();
const companyRepository=new CompanyRepository();
const passwordHasher=new BcryptPasswordHasher()
const loginUserUseCase=new LoginUserUseCase(userRepository,passwordHasher,companyRepository);
const signupUseCase=new SignupUseCase(userRepository,passwordHasher)

export const userAuthController=new UserAuthController(loginUserUseCase,refreshTokenUseCase,signupUseCase)