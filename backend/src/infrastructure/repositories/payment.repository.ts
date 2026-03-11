import { Payment } from "../../domain/entities/payment.entity";
import { IPaymentRepository } from "../../domain/repositories/payment.repository";
import { IPaymentDocument, PaymentModel } from "../db/models/payment.model";

export class PaymentRepository implements IPaymentRepository {
    private _toDomain(doc: IPaymentDocument): Payment {
        return new Payment(
            doc._id.toString(),
            doc.companyId.toString(),
            doc.planId.toString(),
            doc.billingCycle,
            doc.orderId,
            doc.paymentId,
            doc.amount,
            doc.currency,
            doc.status,
            doc.createdAt,
            doc.updatedAt
        )
    }

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

        const doc = await PaymentModel.create({
            companyId: data.companyId,
            planId: data.planId,
            billingCycle: data.billingCycle,
            orderId: data.orderId,
            paymentId: data.paymentId,
            amount: data.amount,
            currency: data.currency,
            status: data.status
        })

        return this._toDomain(doc)
    }

    async findByOrderId(orderId: string): Promise<Payment | null> {
        const doc = await PaymentModel.findOne({ orderId });
        if (!doc) return null;
        return this._toDomain(doc)
    }

    async markSuccess(orderId: string, paymentId: string): Promise<void> {
        await PaymentModel.updateOne({ orderId }, { paymentId, status: "SUCCESS" })
    }

    async markFailed(orderId: string): Promise<void> {
        await PaymentModel.updateOne({ orderId }, { status: "FAILED" })
    }

    async findByCompanyId(companyId: string): Promise<Payment[]> {
        const docs = await PaymentModel.find({ companyId }).sort({ createdAt: -1 })

        return docs.map((doc) => this._toDomain(doc))
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

        return this._toDomain(doc);
    }
}

