import { TaskDetailResponsDTO } from "../../dto/task/TaskDetailResponse.dto";

export interface IGetTaskDetailUseCase{
    execute(userId:string,companyId:string,projectId:string,taskId:string):Promise<TaskDetailResponsDTO>
}