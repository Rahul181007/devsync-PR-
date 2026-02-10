import { ProjectTaskListItemDTO } from "../../dto/task/ProjectTaskListItem.dto";

export interface IGetProjectTasksUseCase{
  execute(userId:string,companyId:string,projectId:string):Promise<ProjectTaskListItemDTO[]>
}