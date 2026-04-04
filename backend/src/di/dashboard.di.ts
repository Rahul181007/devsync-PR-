import { IGetCompanyDashboardSummaryUseCase } from "../application/interface/dashboard/companyAdmin/IGetCompanyDashboardSummaryUseCase";
import { IGetDeveloperDashboardUseCase } from "../application/interface/dashboard/developer/getDeveloperDashboard.usecase";
import { IGetSuperAdminDashboardUseCase } from "../application/interface/dashboard/superAdmin/IGetDashboardUseCase";
import { GetCompanyDashboardSummaryUseCase } from "../application/use-cases/dashboard/companyAdmin/getCompanyDashboardSummary.usecase";
import { GetDeveloperDashboardUseCase } from "../application/use-cases/dashboard/developer/getDeveloperDashboard.usecase";
import { GetSuperAdminDashboardUseCase } from "../application/use-cases/dashboard/superAdmin/getDashboard.usecase";
import { ActivityRepository } from "../infrastructure/repositories/activity.repository";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { ProjectRepository } from "../infrastructure/repositories/project.repository";
import { ProjectMemberRepository } from "../infrastructure/repositories/projectMember.repository";
import { TaskRepository } from "../infrastructure/repositories/task.repository";
import { TransactionQueryRepository } from "../infrastructure/repositories/transaction.query.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { WorklogRepository } from "../infrastructure/repositories/worklog.repository";
import { DashBoardController } from "../interfaces/controllers/dashboard.controller";

const companyRepository = new CompanyRepository();
const transactionQueryRepository = new TransactionQueryRepository();

const taskRepo = new TaskRepository();
const projectRepo = new ProjectRepository();
const userRepo = new UserRepository();
const worklogRepo = new WorklogRepository();
const activityRepo = new ActivityRepository()
const projectMemberRepo=new ProjectMemberRepository()

const getSuperAdminDashboardUseCase: IGetSuperAdminDashboardUseCase = new GetSuperAdminDashboardUseCase(
    companyRepository,
    transactionQueryRepository);
const getCompanyDashboardSummaryUseCase: IGetCompanyDashboardSummaryUseCase = new GetCompanyDashboardSummaryUseCase(
    projectRepo,
    userRepo,
    taskRepo,
    companyRepository,
    worklogRepo,
    activityRepo)

const getDeveloperDashboardUseCase:IGetDeveloperDashboardUseCase=new GetDeveloperDashboardUseCase(
    taskRepo,
    userRepo,
    projectMemberRepo,
    activityRepo,
    worklogRepo
)
export const dashBoardController = new DashBoardController(
    getSuperAdminDashboardUseCase,
    getCompanyDashboardSummaryUseCase,
    getDeveloperDashboardUseCase
)