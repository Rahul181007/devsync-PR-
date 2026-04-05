import { http } from "../../../core/api/http"
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { BillingCycle, CreatePaymentResponse, PaymentHistory, Plan, Subscription } from "../types/billing.types";

export const billingApi = {
    getCurrentSubscription() {
        return http.get<{ success: boolean; data: Subscription }>(
            API_ROUTES.COMPANY.SUBSCRIPTION
        )
    },

    getAvailablePlans() {
        return http.get<{ success: boolean; data: Plan[] }>(
            API_ROUTES.COMPANY.PLANS
        )
    },

    getPaymentHistory() {
        return http.get<{ success: boolean; data: PaymentHistory[] }>(
            API_ROUTES.COMPANY.PAYMENTS
        )
    },

    createPayment(data: {
        planId: string;
        billingCycle: BillingCycle
    }) {
        return http.post<{ success: boolean; data: CreatePaymentResponse }>(
            API_ROUTES.COMPANY.CREATE_PAYMENT,
            data
        )
    },

    verifyPayment(data: {
        orderId: string;
        paymentId: string;
        signature: string;
    }) {
        return http.post<{ success: boolean; message: string }>(
            API_ROUTES.COMPANY.VERIFY_PAYMENT,
            data
        )
    },

        downloadInvoice(invoiceId: string) {
        return http.get(
            API_ROUTES.COMPANY.DOWNLOAD_INVOICE(invoiceId),
            {
                responseType: "blob"
            }
        )
    }
}