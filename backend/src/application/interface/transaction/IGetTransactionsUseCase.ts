import { TransactionListResponseDTO } from "../../dto/transaction/transactionResponse.dto";

export interface IGetTransactionsUseCase {
    execute(
        page: number,
        limit: number,
        status?: "PENDING" | "SUCCESS" | "FAILED",
        search?: string,
        fromDate?: string,
        toDate?: string
    ): Promise<TransactionListResponseDTO>;
}