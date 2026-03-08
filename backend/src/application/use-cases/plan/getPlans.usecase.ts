import { Plan } from "../../../domain/entities/plan.entity";
import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetPlansDTO } from "../../dto/plan/getPlans.dto";
import { IGetPlanUseCase } from "../../interface/plan/getPlans.usecase";

export class GetPlanUseCase implements IGetPlanUseCase{
    constructor(
        private _planRepo:IPlanRepository,
        private _superAdminRepo:ISuperAdminRepository,
    ){}

    async execute(query: GetPlansDTO, superAdminId: string): Promise<{ items: Plan[]; total: number; }> {
        const superAdmin=await this._superAdminRepo.findById(superAdminId)

        if(!superAdmin){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(superAdmin.role!==Role.SUPER_ADMIN){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }
            const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search ?? "";
    const status = query.status ?? "all";
        const plan =await this._planRepo.findAll({
            page,limit,search,status
        });
        return plan
    }
}