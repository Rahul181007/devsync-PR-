import { GetSprintHistorySummaryResponseDTO } from "../../dto/standup/getSprintHistorySummaryResponse.dto";

export interface IGetSprintHistorySummaryUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
    ):Promise<GetSprintHistorySummaryResponseDTO>
}