import { GetTimesheetByProjectRequestDTO } from "../../dto/worklog/getTimesheetByProjectRequest.dto";
import { TimesheetProjectItemDTO } from "../../dto/worklog/getTimesheetByProjectResponse.dto";

export interface IGetTimesheetByProjectUseCase {
  execute(
    userId: string,
    companyId: string,
    projectId: string,
    query: GetTimesheetByProjectRequestDTO
  ): Promise<TimesheetProjectItemDTO[]>;
}