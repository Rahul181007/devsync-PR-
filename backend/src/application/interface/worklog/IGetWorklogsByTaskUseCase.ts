import { WorklogItemDTO } from "../../dto/worklog/getWorklogByTask.dto";

export interface IGetWorklogsByTaskUseCase1{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        taskId:string,
    ):Promise<WorklogItemDTO[]>
}