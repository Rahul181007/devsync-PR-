import { UpdateDeveloperTaskStatus } from "../../dto/task/UpdateDeveloperTaskStatus.dto";

export interface IUpdateDeveloperTaskStatusUseCase {
    execute(userId:string,projectId:string,taskId:string,data:UpdateDeveloperTaskStatus):Promise<void>
}