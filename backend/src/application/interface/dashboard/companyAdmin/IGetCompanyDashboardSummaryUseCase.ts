import { DashboardSummaryDTO } from "../../../dto/dashboard/companyAdmin/dashboardSummary.dto";

export interface IGetCompanyDashboardSummaryUseCase {
    execute(companyId:string):Promise<DashboardSummaryDTO>
}