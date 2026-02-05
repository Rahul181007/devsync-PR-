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
import { RejectCompanyUseCase } from "../application/use-cases/company/reject-company.usecase";
import { ReapplyCompanyUseCase } from "../application/use-cases/company/reapplyCompany.usecase";
import { UnsuspendCompanyUseCase } from "../application/use-cases/company/unsuspend-company.usecase";
import { ICreateCompanyUseCase } from "../application/interface/company/ICreateCompanyUseCase";
import { IListCompaniesUseCase } from "../application/interface/company/IListCompaniesUseCase";
import { IApproveCompanyUseCase } from "../application/interface/company/IApproveCompanyUseCase";
import { ISuspendCompanyUseCase } from "../application/interface/company/ISuspendCompanyUseCase";
import { IGetCompanyByIdUseCase } from "../application/interface/company/IGetCompanyByIdUseCase";
import { IGetMyCompanyUseCase } from "../application/interface/company/IGetMyCompanyUseCase";
import { IUpdateCompanyBrandingUseCase } from "../application/interface/company/IUpdateCompanyBrandingUseCase";
import { IRejectCompanyUseCase } from "../application/interface/company/IRejectCompanyUseCase";
import { IReapplyCompanyUseCase } from "../application/interface/company/IReapplyCompanyUseCase";
import { IUnsuspendCompanyUseCase } from "../application/interface/company/IUnsuspendCompanyUseCase";

const companyRepository=new CompanyRepository();
const userRepository=new UserRepository();
const inviteRepository=new InviteRepository()
const fileStorage=new S3FileStorage()

const createCompanyUseCase:ICreateCompanyUseCase=new CreateCompanyUseCase(companyRepository);
const listCompaniesUseCase:IListCompaniesUseCase=new ListCompaniesUseCase(companyRepository,inviteRepository,userRepository);
const approveCompanyUseCase:IApproveCompanyUseCase=new ApproveCompanyUseCase(companyRepository);
const suspendCompanyUseCase:ISuspendCompanyUseCase=new SuspendCompanyUseCase(companyRepository);
const createWorkspaceUseCase=new CreateWorkspaceUseCase(companyRepository,userRepository)
const getCompanyByIdUseCase:IGetCompanyByIdUseCase= new GetCompanyIdUseCase(companyRepository,userRepository,inviteRepository)
const getMyCompanyUseCase:IGetMyCompanyUseCase=new GetMyCompanyUseCase(companyRepository)
const updateCompanyBrandingUseCase:IUpdateCompanyBrandingUseCase=new UpdateCompanyBrandingUseCase(companyRepository,fileStorage);
const rejectCompanyUseCase:IRejectCompanyUseCase=new RejectCompanyUseCase(companyRepository)
const reapplyCompanyUseCase:IReapplyCompanyUseCase=new ReapplyCompanyUseCase(companyRepository);
const unsuspendCompanyUseCase:IUnsuspendCompanyUseCase=new UnsuspendCompanyUseCase(companyRepository)

export const companyController=new CompanyController(
    createCompanyUseCase,
    listCompaniesUseCase,
    approveCompanyUseCase,
    suspendCompanyUseCase,
    getCompanyByIdUseCase,
    createWorkspaceUseCase,
    getMyCompanyUseCase,
    updateCompanyBrandingUseCase,
    rejectCompanyUseCase,
    reapplyCompanyUseCase,
    unsuspendCompanyUseCase
);