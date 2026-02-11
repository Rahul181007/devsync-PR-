import { DeveloperTaskDetailDTO } from "../../dto/task/DeveloperTaskDetail.dto";

export interface IGetDeveloperTaskDetailUseCase{
    execute(userId:string,projectId:string,taskId:string):Promise<DeveloperTaskDetailDTO>
}