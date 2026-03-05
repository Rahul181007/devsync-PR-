import { UpdatePlanDTO } from "../../dto/plan/updatePlan.dto";

export interface IUpdatePlanUseCase{
    execute(
        planId:string,
        data:UpdatePlanDTO,
        superAdminId:string
    ):Promise<void>
}