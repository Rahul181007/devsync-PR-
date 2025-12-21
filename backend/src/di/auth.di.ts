import { SuperAdminRepository } from "../infrastructure/repositories/superAdmin.repository";
import { LoginSuperAdminUseCase } from "../application/use-cases/auth/loginSuperAdmin.usecase";
import { AuthController } from "../interfaces/controllers/auth.controllers";
import { refreshTokenUseCase } from "./authRefresh.di";


const superAdminRepo=new SuperAdminRepository();

const loginUseCase= new LoginSuperAdminUseCase(superAdminRepo);
export const authController=new AuthController(loginUseCase,refreshTokenUseCase)