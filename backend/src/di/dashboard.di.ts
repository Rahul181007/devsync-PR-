import { IGetCompanyDashboardSummaryUseCase } from "../application/interface/dashboard/companyAdmin/IGetCompanyDashboardSummaryUseCase";
import { IGetSuperAdminDashboardUseCase } from "../application/interface/dashboard/superAdmin/IGetDashboardUseCase";
import { GetCompanyDashboardSummaryUseCase } from "../application/use-cases/dashboard/companyAdmin/getCompanyDashboardSummary.usecase";
import { GetSuperAdminDashboardUseCase } from "../application/use-cases/dashboard/superAdmin/getDashboard.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { TransactionQueryRepository } from "../infrastructure/repositories/transaction.query.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { WorklogRepository } from "../infrastructure/repositories/worklog.repository";
import { DashBoardController } from "../interfaces/controllers/dashboard.controller";

const companyRepository = new CompanyRepository();
const transactionQueryRepository = new TransactionQueryRepository();

const taskRepo=new TaskRepository();
const projectRepo=new ProjectRepository();
const userRepo=new UserRepository();
const worklogRepo=new WorklogRepository();
const getSuperAdminDashboardUseCase:IGetSuperAdminDashboardUseCase=new GetSuperAdminDashboardUseCase(companyRepository,transactionQueryRepository);
 const getCompanyDashboardSummaryUseCase:IGetCompanyDashboardSummaryUseCase=new GetCompanyDashboardSummaryUseCase(projectRepo,userRepo,taskRepo,companyRepository,worklogRepo)
export const dashBoardController=new DashBoardController (
    getSuperAdminDashboardUseCase,
     getCompanyDashboardSummaryUseCase
)