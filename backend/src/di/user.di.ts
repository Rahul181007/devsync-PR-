import { UserRepository } from "../infrastructure/repositories/user.repository";
import { LoginUserUseCase } from "../application/use-cases/auth/loginUser.usecase";
import { UseAuthController } from "../interfaces/controllers/userAuth.controller";
import { RefreshTokenUseCase } from "../application/use-cases/auth/refreshUserToken.usecase";

const userRepository=new UserRepository();

const loginUserUseCase=new LoginUserUseCase(userRepository);
 const refreshTokenUseCase=new RefreshTokenUseCase(userRepository)
export const userAuthController=new UseAuthController(loginUserUseCase,refreshTokenUseCase)