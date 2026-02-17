import { PlanSprintRequestDTO } from "../../dto/task/planSprint.dto";

export interface IPlanSprintTasksUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        data:PlanSprintRequestDTO
    ):Promise<void>
}