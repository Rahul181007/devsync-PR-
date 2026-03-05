import { Plan } from "../../../domain/entities/plan.entity";
import { GetPlansDTO } from "../../dto/plan/getPlans.dto";

export interface IGetPlanUseCase{
    execute(
        query:GetPlansDTO,
        superAdminId:string
    ):Promise<{items:Plan[];total:number}>
}