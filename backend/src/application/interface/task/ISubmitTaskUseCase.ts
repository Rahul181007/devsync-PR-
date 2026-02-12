import { SubmitTaskDTO } from "../../dto/task/SubmitTask.dto";

export interface ISubmitTaskUseCase{
    execute(userId:string,projectId:string,taskId:string,data:SubmitTaskDTO):Promise<void>
}