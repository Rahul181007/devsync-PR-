import { CreatePaymentDTO } from "../../dto/payment/createPayment.dto";
import { CreatePaymentResponseDTO } from "../../dto/payment/createPaymentResponse.dto";

export interface ICreatePaymentUseCase{
    execute(data:CreatePaymentDTO):Promise<CreatePaymentResponseDTO>
}