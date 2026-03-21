import { GetWorklogsByProjectRequestDTO } from "../../dto/worklog/getWorklogsByProjectRequest.dto"; 
import { WorklogProjectItemDTO } from "../../dto/worklog/getWorklogsByProjectResponse.dto";

export interface IGetWorklogsByProjectUseCase {
  execute(
    userId: string,
    companyId: string,
    projectId: string,
    query: GetWorklogsByProjectRequestDTO
  ): Promise<WorklogProjectItemDTO[]>;
}