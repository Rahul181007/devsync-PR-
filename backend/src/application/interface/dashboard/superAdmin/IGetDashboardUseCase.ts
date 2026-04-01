import { DashboardResponseDTO } from "../../../dto/dashboard/superAdmin/dashboard.response.dto";

export interface IGetSuperAdminDashboardUseCase {
  execute(): Promise<DashboardResponseDTO>;
}