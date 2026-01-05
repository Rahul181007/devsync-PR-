import { UserRepository } from "../infrastructure/repositories/user.repository";
import { LoginUserUseCase } from "../application/use-cases/auth/loginUser.usecase";
import { UserAuthController } from "../interfaces/controllers/userAuth.controller";
import { refreshTokenUseCase } from "./authRefresh.di";
import { BcryptPasswordHasher } from "../infrastructure/security/bcryptPasswordHasher";
const userRepository=new UserRepository();
const passwordHasher=new BcryptPasswordHasher()
const loginUserUseCase=new LoginUserUseCase(userRepository,passwordHasher);
 
export const userAuthController=new UserAuthController(loginUserUseCase,refreshTokenUseCase)