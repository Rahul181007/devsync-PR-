import { SuperAdminRepository } from "../infrastructure/repositories/superAdmin.repository";
import { LoginSuperAdminUseCase } from "../application/use-cases/auth/loginSuperAdmin.usecase";
import { AuthController } from "../interfaces/controllers/auth.controller";
import { refreshTokenUseCase } from "./authRefresh.di";
import { GetAuthMeUseCase } from "../application/use-cases/auth/getAuthMe.usecase";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { IGetAuthMeUseCase } from "../application/interface/auth/IGetAuthMeUseCase";
import { ILoginSuperAdminUseCase } from "../application/interface/auth/ILoginSuperAdminUseCase";


const superAdminRepo=new SuperAdminRepository();
const userRepository=new UserRepository(); 
const companyRepository=new CompanyRepository()
const loginUseCase:ILoginSuperAdminUseCase= new LoginSuperAdminUseCase(superAdminRepo);
const getAuthMeUseCase:IGetAuthMeUseCase=new GetAuthMeUseCase(userRepository,companyRepository,superAdminRepo)
export const authController=new AuthController(loginUseCase,refreshTokenUseCase,getAuthMeUseCase);