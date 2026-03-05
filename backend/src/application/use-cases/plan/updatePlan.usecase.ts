import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { UpdatePlanDTO } from "../../dto/plan/updatePlan.dto";
import { IUpdatePlanUseCase } from "../../interface/plan/IUpdatePlanUseCase";

export class UpdatePlanUseCase implements IUpdatePlanUseCase {
    constructor(
        private _planRepo: IPlanRepository,
        private _superAdminRepo: ISuperAdminRepository
    ) { }

    async execute(planId: string, data: UpdatePlanDTO, superAdminId: string): Promise<void> {
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
            )
        }
        if (data.name) {
            plan.name = data.name;
        }

        if (data.description) {
            plan.description = data.description;
        }

        if (data.pricePerMonth !== undefined) {
            plan.pricePerMonth = data.pricePerMonth;
        }

        if (data.pricePerYear !== undefined) {
            plan.pricePerYear = data.pricePerYear;
        }

        if (data.currency) {
            plan.currency = data.currency;
        }

        if (data.features) {
            plan.features = data.features;
        }

        if (data.limits) {
            plan.limits = {
                ...plan.limits,
                ...data.limits
            };
        }

        if (data.isActive !== undefined) {
            plan.isActive = data.isActive;
        }

        await this._planRepo.save(plan);
    }

}