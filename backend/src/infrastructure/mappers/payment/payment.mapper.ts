import { Types } from "mongoose";
import { IPaymentDocument } from "../../db/models/payment.model";
import { Payment } from "../../../domain/entities/payment.entity";

export class PaymentMapper {

  // ✅ DB → Domain
  static toDomain(doc: IPaymentDocument): Payment {
    return new Payment(
      doc._id.toString(),
      doc.companyId.toString(),
      doc.planId.toString(),
      doc.billingCycle,
      doc.orderId,
      doc.paymentId ?? null,
      doc.amount,
      doc.currency,
      doc.status,
      doc.createdAt,
      doc.updatedAt
    );
  }

  // ✅ Input → DB
  static toDocument(data: {
    companyId: string;
    planId: string;
    billingCycle: "MONTHLY" | "YEARLY";
    orderId: string;
    paymentId: string | null;
    amount: number;
    currency: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
  }) {
    return {
      companyId: new Types.ObjectId(data.companyId),
      planId: new Types.ObjectId(data.planId),
      billingCycle: data.billingCycle,
      orderId: data.orderId,
      paymentId: data.paymentId ?? null,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
    };
  }
}