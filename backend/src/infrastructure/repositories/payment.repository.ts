import { Payment } from "../../domain/entities/payment.entity";
import { IPaymentRepository } from "../../domain/repositories/payment.repository";
import { PaymentModel } from "../db/models/payment.model";
import { PaymentMapper } from "../mappers/payment/payment.mapper";

export class PaymentRepository implements IPaymentRepository {


    async create(data: {
        companyId: string;
        planId: string;
        billingCycle: "MONTHLY" | "YEARLY";
        orderId: string;
        paymentId: string | null;
        amount: number;
        currency: string;
        status: "PENDING" | "SUCCESS" | "FAILED";
    }): Promise<Payment> {

        const doc = await PaymentModel.create(PaymentMapper.toDocument(data))

        return PaymentMapper.toDomain(doc)
    }

    async findByOrderId(orderId: string): Promise<Payment | null> {
        const doc = await PaymentModel.findOne({ orderId });
        if (!doc) return null;
        return PaymentMapper.toDomain(doc)
    }

    async markSuccess(orderId: string, paymentId: string): Promise<void> {
        await PaymentModel.updateOne({ orderId }, { paymentId, status: "SUCCESS" })
    }

    async markFailed(orderId: string): Promise<void> {
        await PaymentModel.updateOne({ orderId }, { status: "FAILED" })
    }

    async findByCompanyId(companyId: string): Promise<Payment[]> {
        const docs = await PaymentModel.find({ companyId }).sort({ createdAt: -1 })

        return docs.map((doc) => PaymentMapper.toDomain(doc))
    }

    async findPendingPayment(
        companyId: string,
        planId: string,
        billingCycle: "MONTHLY" | "YEARLY"
    ): Promise<Payment | null> {

        const doc = await PaymentModel.findOne({
            companyId,
            planId,
            billingCycle,
            status: "PENDING"
        }).sort({ createdAt: -1 });

        if (!doc) return null;

        return PaymentMapper.toDomain(doc);
    }
}

