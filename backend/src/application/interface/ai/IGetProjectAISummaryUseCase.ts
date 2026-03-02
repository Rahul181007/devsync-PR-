import { ProjectAISummaryDTO } from "../../dto/ai/projectAISummary.dto";

export interface IGetProjectAISummaryUseCase {
    execute(
        userId:string,
        companyId:string,
        projectId:string
    ):Promise<ProjectAISummaryDTO>
}