import { http } from "../../../core/api/http"
import type { BillingCycle, CreatePaymentResponse, PaymentHistory, Plan, Subscription } from "../types/billing.types";

export const billingApi = {
    getCurrentSubscription() {
        return http.get<{ success: boolean; data: Subscription }>(
            "/company/subscription"
        )
    },

    getAvailablePlans() {
        return http.get<{ success: boolean; data: Plan[] }>(
            "/company/plans"
        )
    },

    getPaymentHistory() {
        return http.get<{ success: boolean; data: PaymentHistory[] }>(
            "/company/payments"
        )
    },

    createPayment(data: {
        planId: string;
        billingCycle: BillingCycle
    }) {
        return http.post<{ success: boolean; data: CreatePaymentResponse }>(
            "/company/payment/create",
            data
        )
    },

    verifyPayment(data: {
        orderId: string;
        paymentId: string;
        signature: string;
    }) {
        return http.post<{ success: boolean; message: string }>(
            "/company/payment/verify",
            data
        )
    },

        downloadInvoice(invoiceId: string) {
        return http.get(
            `/company/invoice/${invoiceId}`,
            {
                responseType: "blob"
            }
        )
    }
}