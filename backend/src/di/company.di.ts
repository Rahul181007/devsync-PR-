import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { CreateCompanyUseCase } from "../application/use-cases/company/createCompany.usecase";
import { CompanyController } from "../interfaces/controllers/company.controller";
import { ListCompaniesUseCase } from "../application/use-cases/company/listCompanies.usecase";
import { ApproveCompanyUseCase } from "../application/use-cases/company/approveCompany.usecase";
import { SuspendCompanyUseCase } from "../application/use-cases/company/suspendCompany.usecase";

const companyRepository=new CompanyRepository();
const userRepo=new UserRepository();

const createCompanyUseCase=new CreateCompanyUseCase(companyRepository,userRepo);
const listCompaniesUseCase=new ListCompaniesUseCase(companyRepository);
const approveCompanyUseCase=new ApproveCompanyUseCase(companyRepository);
const suspendCompanyUseCase=new SuspendCompanyUseCase(companyRepository);

export const companyController=new CompanyController(
    createCompanyUseCase,
    listCompaniesUseCase,
    approveCompanyUseCase,
    suspendCompanyUseCase
);