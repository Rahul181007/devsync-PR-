import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetAvailablePlansResponseDTO } from "../../dto/plan/getAvailablePlansResponse.dto";
import { IGetAvailablePlansUseCase } from "../../interface/plan/IGetAvailablePlansUseCase";

export class GetAvailablePlansUseCase implements IGetAvailablePlansUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _planRepo: IPlanRepository,
        private _companyRepo: ICompanyRepository
    ) { }
    async execute(userId: string, companyId: string): Promise<GetAvailablePlansResponseDTO[]> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        const company = await this._companyRepo.findById(companyId)
        if (!company) {
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if (user.companyId !== company.id) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        const plans = await this._planRepo.findAvailablePlans();
        const upgradePlans = plans.filter(plan =>
  plan.id !== company.currentPlanId &&
  plan.pricePerMonth > 0
)
        return upgradePlans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            pricePerMonth: plan.pricePerMonth,
            pricePerYear: plan.pricePerYear,
            currency: plan.currency,
            features: plan.features,
            limits: {
                maxProjects: plan.limits.maxProjects,
                maxDevelopers: plan.limits.maxDevelopers,
                maxStorageGB: plan.limits.maxStorageGB
            }
        }))
    }
}