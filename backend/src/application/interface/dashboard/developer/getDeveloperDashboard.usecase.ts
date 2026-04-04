import { DeveloperDashboardResponseDto } from "../../../dto/dashboard/developer/dashboard.dto";

export interface IGetDeveloperDashboardUseCase{
    execute (userId:string):Promise<DeveloperDashboardResponseDto>
}