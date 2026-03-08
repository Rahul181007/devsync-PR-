import { IGetPlanUseCase } from "../application/interface/plan/getPlans.usecase";
import { ICreatePlanUseCase } from "../application/interface/plan/ICreatePlanUseCase";
import { IDeletePlanUseCase } from "../application/interface/plan/IDeletePlanUseCase";
import { IGetPlanByIdUseCase } from "../application/interface/plan/IGetPlanByIdUseCase";
import { IUpdatePlanUseCase } from "../application/interface/plan/IUpdatePlanUseCase";
import { CreatePlanUseCase } from "../application/use-cases/plan/createPlan.usecase";
import { DeletePlanUseCase } from "../application/use-cases/plan/deletePlan.usecase";
import { GetPlanByIdUseCase } from "../application/use-cases/plan/getPlanById.usecase";
import { GetPlanUseCase } from "../application/use-cases/plan/getPlans.usecase";
import { UpdatePlanUseCase } from "../application/use-cases/plan/updatePlan.usecase";
import { PlanRepository } from "../infrastructure/repositories/plan.repository";
import { SuperAdminRepository } from "../infrastructure/repositories/superAdmin.repository";
import { PlanController } from "../interfaces/controllers/plan.controller";

const superAdminRepo = new SuperAdminRepository();
const planRepo = new PlanRepository();

const createPlanUseCase: ICreatePlanUseCase = new CreatePlanUseCase(planRepo, superAdminRepo);
const getPlansUseCase: IGetPlanUseCase = new GetPlanUseCase(planRepo, superAdminRepo);
const getPlanByIdUseCase: IGetPlanByIdUseCase = new GetPlanByIdUseCase(planRepo, superAdminRepo);
const updatePlanUseCase: IUpdatePlanUseCase = new UpdatePlanUseCase(planRepo, superAdminRepo);
const deletePlanUseCase:IDeletePlanUseCase=new DeletePlanUseCase(planRepo,superAdminRepo)

export const planController = new PlanController(
    createPlanUseCase,
    getPlansUseCase,
    getPlanByIdUseCase,
    updatePlanUseCase,
    deletePlanUseCase
);