import { Orders } from "razorpay/dist/types/orders";

export interface IPaymentService {
  createOrder(
    amount: number,
    currency: string,
    receipt: string,
    notes?: Record<string, string>
  ): Promise<Orders.RazorpayOrder>;

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean;
}