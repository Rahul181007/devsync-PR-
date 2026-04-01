import { IGetSuperAdminDashboardUseCase } from "../application/interface/dashboard/superAdmin/IGetDashboardUseCase";
import { GetSuperAdminDashboardUseCase } from "../application/use-cases/dashboard/superAdmin/getDashboard.usecase";
import { CompanyRepository } from "../infrastructure/repositories/company.repository";
import { TransactionQueryRepository } from "../infrastructure/repositories/transaction.query.repository";
import { DashBoardController } from "../interfaces/controllers/dashboard.controller";

const companyRepository = new CompanyRepository();
const transactionQueryRepository = new TransactionQueryRepository();

const getSuperAdminDashboardUseCase:IGetSuperAdminDashboardUseCase=new GetSuperAdminDashboardUseCase(companyRepository,transactionQueryRepository);

export const dashBoardController=new DashBoardController (
    getSuperAdminDashboardUseCase
)