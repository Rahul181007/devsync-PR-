import { Payment } from "../entities/payment.entity";

export interface IPaymentRepository {
    create(data: {
        companyId: string;
        planId: string;
        billingCycle: "MONTHLY" | "YEARLY";
        orderId: string;
        paymentId: string | null;
        amount: number;
        currency: string;
        status: "PENDING" | "SUCCESS" | "FAILED";
    }): Promise<Payment>;
    findByOrderId(orderId: string): Promise<Payment | null>;
    markSuccess(orderId: string, paymentId: string): Promise<void>;
    markFailed(orderId: string): Promise<void>
    findByCompanyId(companyId: string): Promise<Payment[]>
}