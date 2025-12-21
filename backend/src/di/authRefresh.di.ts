import { SuperAdminRepository } from "../infrastructure/repositories/superAdmin.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { RefreshTokenUseCase } from "../application/use-cases/auth/refreshToken.usecase";

const userRepository=new UserRepository();
const superAdminRepository=new SuperAdminRepository();

export const refreshTokenUseCase=new RefreshTokenUseCase(superAdminRepository,userRepository)