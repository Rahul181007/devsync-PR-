
import { PlanSprintResponseDTO } from "../../dto/sprint/planSprintResponse.dto";
import { PlanSprintRequestDTO } from "../../dto/task/planSprint.dto";

export interface IPlanSprintUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        data:PlanSprintRequestDTO
    ):Promise<PlanSprintResponseDTO>
}