import { CreateWorklogRequestDTO } from "../../dto/worklog/createWorklog.dto";

export interface ICreateWorklogUseCase {
    execute(
        userId: string,
        companyId: string,
        projectId: string,
        taskId: string,
        data: CreateWorklogRequestDTO
    ): Promise<void>;
}