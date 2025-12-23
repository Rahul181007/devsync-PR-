import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { CreateCompanyUseCase } from "../application/use-cases/company/createCompany.usecase";
import { CompanyController } from "../interfaces/controllers/company.controller";

const companyRepository=new CompanyRepository();
const userRepo=new UserRepository();

const createCompanyUseCase=new CreateCompanyUseCase(companyRepository,userRepo)

export const companyController=new CompanyController(createCompanyUseCase);