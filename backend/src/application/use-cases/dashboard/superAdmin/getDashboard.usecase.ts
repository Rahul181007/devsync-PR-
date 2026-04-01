import { ICompanyRepository } from "../../../../domain/repositories/company.repository";
import { ITransactionQueryRepository } from "../../../../domain/repositories/transaction.query.repository";
import { DashboardResponseDTO } from "../../../dto/dashboard/superAdmin/dashboard.response.dto";
import { IGetSuperAdminDashboardUseCase } from "../../../interface/dashboard/superAdmin/IGetDashboardUseCase";

export class GetSuperAdminDashboardUseCase implements IGetSuperAdminDashboardUseCase{
    constructor(
        private _companyRepo:ICompanyRepository,
        private _transactionQueryRepo:ITransactionQueryRepository
    ){}

    async execute(): Promise<DashboardResponseDTO> {
        const totalCompanies=await this._companyRepo.countAll();
        const activeCompanies=await this._companyRepo.countByStatus("APPROVED");
        const pendingCompanies=await this._companyRepo.countByStatus("PENDING");
        const  revenueChart=await this._transactionQueryRepo.getRevenueByMonth();
        const planDistribution=await this._companyRepo.getPlanDistribution()
        const totalRevenue=await this._transactionQueryRepo.getTotalRevenue();

        return {
            stats:{
                totalCompanies,
                activeCompanies,
                pendingCompanies,
                totalRevenue
            },
            revenueChart,
            planDistribution
        }
    }
}