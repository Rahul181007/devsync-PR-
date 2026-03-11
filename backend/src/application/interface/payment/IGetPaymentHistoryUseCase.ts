import { GetPaymentHistoryDTO, GetPaymentHistoryResponseDTO, } from "../../dto/payment/getPaymentHistoryDTO";

export interface IGetPaymentHistoryUseCase {
    execute(data: GetPaymentHistoryDTO): Promise<GetPaymentHistoryResponseDTO[]>
}