import { env } from "../../../config/env";
import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IPaymentRepository } from "../../../domain/repositories/payment.repository";
import { IPlanRepository } from "../../../domain/repositories/plan.repository";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IPaymentService } from "../../../domain/service/payment.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { CreatePaymentDTO } from "../../dto/payment/createPayment.dto";
import { CreatePaymentResponseDTO } from "../../dto/payment/createPaymentResponse.dto";
import { ICreatePaymentUseCase } from "../../interface/payment/ICreatePaymentUseCase";

export class CreatePaymentUseCase implements ICreatePaymentUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _companyRepo: ICompanyRepository,
        private _planRepo: IPlanRepository,
        private _paymentRepo: IPaymentRepository,
        private _razorpayService: IPaymentService,
        private _subscriptionRepo: ISubscriptionRepository
    ) { }

    async execute(data: CreatePaymentDTO): Promise<CreatePaymentResponseDTO> {
        const user = await this._userRepo.findById(data.userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }
        const company = await this._companyRepo.findById(data.companyId);
        if (!company) {
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (user.companyId != company.id) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }
        const plan = await this._planRepo.findById(data.planId);
        if (!plan) {
            throw new AppError(
                RESPONSE_MESSAGES.PLAN.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )

        }

        const currentSubscription =
            await this._subscriptionRepo.findActiveByCompany(company.id);

        if (currentSubscription?.planId === plan.id) {
            throw new AppError(
                RESPONSE_MESSAGES.SUBSCRIPTION.ALREADY_SUBSCRIBED,
                HttpStatus.BAD_REQUEST
            );
        }

        const baseAmount =
            data.billingCycle === "MONTHLY"
                ? plan.pricePerMonth
                : plan.pricePerYear;

        const amount = baseAmount * 100;

        const receipt = `devsync_${company.id}_${Date.now()}`;

        const order = await this._razorpayService.createOrder(
            amount,
            plan.currency,
            receipt
        )

        await this._paymentRepo.create({
            companyId: company.id,
            planId: plan.id,
            billingCycle: data.billingCycle,
            orderId: order.id,
            paymentId: null,
            amount: baseAmount,
            currency: plan.currency,
            status: "PENDING",
        })

        return {
            orderId: order.id,
            amount,
            currency: plan.currency,
            keyId: env.RAZORPAY_KEY_ID
        }
    }
}