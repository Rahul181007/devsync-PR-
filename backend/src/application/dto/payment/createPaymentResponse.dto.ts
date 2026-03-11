export interface CreatePaymentResponseDTO {
  orderId: string;
  amount: number;
  razorpayAmount: number;
  currency: string;
  keyId: string;
}