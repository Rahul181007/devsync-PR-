import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { IDeletePlanUseCase } from "../../interface/plan/IDeletePlanUseCase";

export class DeletePlanUseCase implements IDeletePlanUseCase {
    constructor(
        private _planRepo: IPlanRepository,
        private _superAdminRepo: ISuperAdminRepository
    ) { }

    async execute(planId: string, superAdminId: string): Promise<void> {
        const superAdmin = await this._superAdminRepo.findById(superAdminId);

        if (!superAdmin) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        if (superAdmin.role !== Role.SUPER_ADMIN) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            );
        }

        const plan = await this._planRepo.findById(planId);
        if (!plan) {
            throw new AppError(
                RESPONSE_MESSAGES.PLAN.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }


        plan.isActive = false;

        await this._planRepo.save(plan);
    }
}