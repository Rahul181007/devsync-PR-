import { CreatePlanDTO } from "../../dto/plan/createPlan.dto";

export interface ICreatePlanUseCase{
    execute(data:CreatePlanDTO,superAdminId:string):Promise<void>
}