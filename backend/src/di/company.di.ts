import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { CreateCompanyUseCase } from "../application/use-cases/company/createCompany.usecase";
import { CompanyController } from "../interfaces/controllers/company.controller";
import { ListCompaniesUseCase } from "../application/use-cases/company/listCompanies.usecase";
import { ApproveCompanyUseCase } from "../application/use-cases/company/approveCompany.usecase";
import { SuspendCompanyUseCase } from "../application/use-cases/company/suspendCompany.usecase";
import { GetCompanyIdUseCase } from "../application/use-cases/company/getCompanyById.usecase";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { InviteRepository } from "../infrastructure/repositories/invite.repository";
import { CreateWorkspaceUseCase } from "../application/use-cases/company/createWorkspace.usecase";

const companyRepository=new CompanyRepository();
const userRepository=new UserRepository();
const inviteRepository=new InviteRepository()

const createCompanyUseCase=new CreateCompanyUseCase(companyRepository);
const listCompaniesUseCase=new ListCompaniesUseCase(companyRepository);
const approveCompanyUseCase=new ApproveCompanyUseCase(companyRepository);
const suspendCompanyUseCase=new SuspendCompanyUseCase(companyRepository);
const createWorkspaceUseCase=new CreateWorkspaceUseCase(companyRepository,userRepository)
const getCompanyByIdUseCase=new GetCompanyIdUseCase(companyRepository,userRepository,inviteRepository)

export const companyController=new CompanyController(
    createCompanyUseCase,
    listCompaniesUseCase,
    approveCompanyUseCase,
    suspendCompanyUseCase,
    getCompanyByIdUseCase,
    createWorkspaceUseCase
);