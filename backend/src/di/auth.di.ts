import { SuperAdminRepository } from "../infrastructure/repositories/superAdmin.repository";
import { LoginSuperAdminUseCase } from "../application/use-cases/auth/loginSuperAdmin.usecase";
import { AuthController } from "../interfaces/controllers/auth.controllers";
import { RefreshTokenUseCase } from "../application/use-cases/auth/refreshToken.usecase";

const superAdminRepo=new SuperAdminRepository();
const loginUseCase= new LoginSuperAdminUseCase(superAdminRepo);
const refreshTokenUseCase=new RefreshTokenUseCase()

export const authController=new AuthController(loginUseCase,refreshTokenUseCase)