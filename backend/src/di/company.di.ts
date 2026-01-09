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
import { GetMyCompanyUseCase } from "../application/use-cases/company/getMyCompany.usecase";
import { UpdateCompanyBrandingUseCase } from "../application/use-cases/company/updateCompanyBranding.usecase";
import { S3FileStorage } from "../infrastructure/services/S3/s3FileStorage.service";

const companyRepository=new CompanyRepository();
const userRepository=new UserRepository();
const inviteRepository=new InviteRepository()
const fileStorage=new S3FileStorage()

const createCompanyUseCase=new CreateCompanyUseCase(companyRepository);
const listCompaniesUseCase=new ListCompaniesUseCase(companyRepository,inviteRepository,userRepository);
const approveCompanyUseCase=new ApproveCompanyUseCase(companyRepository);
const suspendCompanyUseCase=new SuspendCompanyUseCase(companyRepository);
const createWorkspaceUseCase=new CreateWorkspaceUseCase(companyRepository,userRepository)
const getCompanyByIdUseCase=new GetCompanyIdUseCase(companyRepository,userRepository,inviteRepository)
const getMyCompanyUseCase=new GetMyCompanyUseCase(companyRepository)
const updateCompanyBrandingUseCase=new UpdateCompanyBrandingUseCase(companyRepository,fileStorage);


export const companyController=new CompanyController(
    createCompanyUseCase,
    listCompaniesUseCase,
    approveCompanyUseCase,
    suspendCompanyUseCase,
    getCompanyByIdUseCase,
    createWorkspaceUseCase,
    getMyCompanyUseCase,
    updateCompanyBrandingUseCase
);