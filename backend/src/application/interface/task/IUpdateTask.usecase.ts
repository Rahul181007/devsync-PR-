import { TaskResponseDTO } from "../../dto/task/taskResponse.dto";
import { UpdateTaskRequestDTO } from "../../dto/task/updateTaskRequest.dto";

export interface IupdateTaskUseCase{
    execute(userId:string,companyId:string,projectId:string,taskId:string,data:UpdateTaskRequestDTO):Promise<TaskResponseDTO>
}