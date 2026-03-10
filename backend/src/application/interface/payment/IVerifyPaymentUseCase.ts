import { VerifyPaymentDTO } from "../../dto/payment/verifyPayment.dto";

export interface IVerifyPaymentUseCase{
    execute(data:VerifyPaymentDTO):Promise<void>
}