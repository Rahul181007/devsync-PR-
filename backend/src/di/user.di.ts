import { UserRepository } from "../infrastructure/repositories/user.repository";
import { LoginUserUseCase } from "../application/use-cases/auth/loginUser.usecase";
import { UseAuthController } from "../interfaces/controllers/userAuth.controller";
import { refreshTokenUseCase } from "./authRefresh.di";
const userRepository=new UserRepository();

const loginUserUseCase=new LoginUserUseCase(userRepository);
 
export const userAuthController=new UseAuthController(loginUserUseCase,refreshTokenUseCase)