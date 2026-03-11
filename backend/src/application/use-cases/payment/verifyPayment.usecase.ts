import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IPaymentRepository } from "../../../domain/repositories/payment.repository";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";
import { IPaymentService } from "../../../domain/service/payment.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { VerifyPaymentDTO } from "../../dto/payment/verifyPayment.dto";
import { IVerifyPaymentUseCase } from "../../interface/payment/IVerifyPaymentUseCase";

export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
    constructor(
        private _paymentRepo: IPaymentRepository,
        private _subscriptionRepo: ISubscriptionRepository,
        private _companyRepo: ICompanyRepository,
        private _razorpayService: IPaymentService
    ) { }

    async execute(data: VerifyPaymentDTO): Promise<void> {
        const payment = await this._paymentRepo.findByOrderId(data.orderId);
        if (!payment) {
            throw new AppError(
                RESPONSE_MESSAGES.PAYMENT.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (payment.companyId !== data.companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        if (payment.status === "SUCCESS") {
            return;
        }

        const isValid = this._razorpayService.verifyPaymentSignature(
            data.orderId,
            data.paymentId,
            data.signature
        )

        if (!isValid) {
            await this._paymentRepo.markFailed(data.orderId);
            throw new AppError(
                RESPONSE_MESSAGES.PAYMENT.INVALID_SIGNATURE,
                HttpStatus.BAD_REQUEST
            )
        }


        const currentSubscription = await this._subscriptionRepo.findActiveByCompany(payment.companyId);

        if (currentSubscription) {
            currentSubscription.status = "CANCELLED";
            currentSubscription.endDate = new Date()
            await this._subscriptionRepo.save(currentSubscription)
        }

        const startDate = new Date();
        const endDate = new Date();

        if (payment.billingCycle === "MONTHLY") {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const newSubscription = await this._subscriptionRepo.create({
            companyId: payment.companyId,
            planId: payment.planId,
            status: "ACTIVE",
            billingCycle: payment.billingCycle,
            startDate,
            endDate,
            renewsAt: endDate
        });

        const company = await this._companyRepo.findById(payment.companyId);
        if (!company) {
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        await this._companyRepo.updateSubscription(payment.companyId, {
            subscriptionId: newSubscription.id,
            currentPlanId: payment.planId
        });
        await this._paymentRepo.markSuccess(data.orderId, data.paymentId);
    }


}