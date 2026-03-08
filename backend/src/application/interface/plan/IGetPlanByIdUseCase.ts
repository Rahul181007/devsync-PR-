import { Plan } from "../../../domain/entities/plan.entity";

export interface IGetPlanByIdUseCase {
    execute(planId:string,superAdminId:string):Promise<Plan>
}