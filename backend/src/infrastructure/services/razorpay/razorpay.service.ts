import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../../../config/env";
import { IPaymentService } from "../../../domain/service/payment.service";

export class RazorpayService implements IPaymentService {
  private _razorpay: Razorpay;

  constructor() {
    this._razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(
    amount: number,
    currency: string,
    receipt: string,
    notes?: Record<string, string>
  ) {
    return this._razorpay.orders.create({
      amount: amount ,
      currency,
      receipt,
      notes,
    });
  }

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {

    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }
}