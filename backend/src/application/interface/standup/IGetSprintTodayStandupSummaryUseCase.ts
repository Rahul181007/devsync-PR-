
import { GetSprintTodayStandupSummaryResponseDTO } from "../../dto/standup/getSprintTodayStandupSummaryResponse.dto";

export interface IGetSprintTodayStandupSummaryUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string
    ):Promise<GetSprintTodayStandupSummaryResponseDTO>
}