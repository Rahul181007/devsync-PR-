export type BillingCycle = "MONTHLY" | "YEARLY";

export interface Subscription {
  subscriptionId: string;
  planId: string;

  planName: string;
  description: string;

  pricePerMonth: number;
  pricePerYear: number;

  currency: "USD" | "INR" | "EUR";

  features: string[];

  limits: {
    maxProjects: number;
    maxDevelopers: number;
    maxStorageGB: number;
  };

  billingCycle: BillingCycle;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";

  startDate: string;
  endDate: string;
  renewsAt: string;
}

export interface Plan {
  id: string;

  name: string;
  description: string;

  pricePerMonth: number;
  pricePerYear: number;

  currency: "USD" | "INR" | "EUR";

  features: string[];

  limits: {
    maxProjects: number;
    maxDevelopers: number;
    maxStorageGB: number;
  };
}

export interface PaymentHistory {
  id: string;

  amount: number;
  currency: string;

  billingCycle: "MONTHLY" | "YEARLY";

  status: "PENDING" | "SUCCESS" | "FAILED";

  createdAt: string;
}

export interface CreatePaymentResponse {
  orderId: string;
  amount: number;
  razorpayAmount: number, 
  currency: string;
  keyId: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
}