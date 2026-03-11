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
        console.log("Selected planId:", data.planId);
        const plan = await this._planRepo.findById(data.planId);

        if (!plan) {
            throw new AppError(
                RESPONSE_MESSAGES.PLAN.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )

        }
        console.log("Fetched planId:", plan.id);

        const currentSubscription =
            await this._subscriptionRepo.findActiveByCompany(company.id);

        if (currentSubscription?.planId === plan.id) {
            throw new AppError(
                RESPONSE_MESSAGES.SUBSCRIPTION.ALREADY_SUBSCRIBED,
                HttpStatus.BAD_REQUEST
            );
        }

        console.log("Billing cycle:", data.billingCycle);
console.log("Plan price month:", plan.pricePerMonth);
console.log("Plan price year:", plan.pricePerYear);

        const baseAmount =
            data.billingCycle === "MONTHLY"
                ? plan.pricePerMonth
                : plan.pricePerYear;

        const TAX_RATE = 0.18;
        const tax = baseAmount * TAX_RATE;
        const totalAmount = baseAmount + tax;

        const amount = Math.round(totalAmount * 100)

        const pendingPayment = await this._paymentRepo.findPendingPayment(
            company.id,
            plan.id,
            data.billingCycle
        );

        const FIVE_MINUTES = 1 * 60 * 1000;

        if (pendingPayment) {

            const age = Date.now() - new Date(pendingPayment.createdAt).getTime();

            if (age < FIVE_MINUTES) {

                // reuse existing order
                return {
                    orderId: pendingPayment.orderId,
                    amount: pendingPayment.amount,
                    razorpayAmount: Math.round(pendingPayment.amount * 100),
                    currency: pendingPayment.currency,
                    keyId: env.RAZORPAY_KEY_ID
                };

            }

            // payment expired → mark FAILED
            await this._paymentRepo.markFailed(pendingPayment.orderId);
        }

        const receipt = `devsync_${Date.now()}`;

        console.log({
  baseAmount,
  tax,
  totalAmount,
  razorpayAmount: amount
});
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
            amount: totalAmount,
            currency: plan.currency,
            status: "PENDING",
        })

        return {
            orderId: order.id,
            amount: totalAmount,
            razorpayAmount: amount,
            currency: plan.currency,
            keyId: env.RAZORPAY_KEY_ID
        }
    }
}