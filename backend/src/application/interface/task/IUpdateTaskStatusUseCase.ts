import { UpdateTaskStatusDTO } from "../../dto/task/UpdateTaskStatus.dto";

export interface IUpdateTaskStatusUseCase{
    execute(userId:string,companyId:string,projectId:string,taskId:string,data:UpdateTaskStatusDTO):Promise<void>
}