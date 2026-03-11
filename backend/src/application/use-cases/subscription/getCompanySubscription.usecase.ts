import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetCompanySubscriptionDTO } from "../../dto/subscription/getCompanySubscription.dto";
import { GetCompanySubscriptionResponseDTO } from "../../dto/subscription/getCompanySubscriptionResponse.dto";
import { IGetCompanySubscriptionUseCase } from "../../interface/subscription/IGetCompanySubscriptionUseCase";

export class GetCompanySubscriptionUseCase implements IGetCompanySubscriptionUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _companyRepo: ICompanyRepository,
        private _planRepo: IPlanRepository,
        private _subscriptionRepo: ISubscriptionRepository
    ) { }

    async execute(data: GetCompanySubscriptionDTO): Promise<GetCompanySubscriptionResponseDTO> {
        const user = await this._userRepo.findById(data.userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const company = await this._companyRepo.findById(data.companyId);
        if (!company) {
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if(user.companyId!==company.id){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        const subscription = await this._subscriptionRepo.findActiveByCompany(company.id);

        if (!subscription) {
            throw new AppError(
                RESPONSE_MESSAGES.SUBSCRIPTION.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        const plan = await this._planRepo.findById(subscription.planId);

        if (!plan) {
            throw new AppError(
                RESPONSE_MESSAGES.PLAN.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        return {
            subscriptionId: subscription.id,
            planId: plan.id,
            planName: plan.name,
            description: plan.description,
            pricePerMonth: plan.pricePerMonth,
            pricePerYear: plan.pricePerYear,
            currency: plan.currency,
            features: plan.features,
            limits: {
                maxProjects: plan.limits.maxProjects,
                maxDevelopers: plan.limits.maxDevelopers,
                maxStorageGB: plan.limits.maxStorageGB
            },

            billingCycle: subscription.billingCycle,
            status: subscription.status,

            startDate: subscription.startDate,
            endDate: subscription.endDate,
            renewsAt: subscription.renewsAt
        }

    }
}