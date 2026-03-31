import { ITransactionQueryRepository } from "../../../domain/repositories/transaction.query.repository";
import { TransactionListResponseDTO } from "../../dto/transaction/transactionResponse.dto";
import { IGetTransactionsUseCase } from "../../interface/transaction/IGetTransactionsUseCase";

export class GetTransactionsUseCase implements IGetTransactionsUseCase{
    constructor(
     private _transactionRepo:ITransactionQueryRepository   
    ){}

    async execute(page: number, limit: number, status?: "PENDING" | "SUCCESS" | "FAILED", search?: string,  fromDate?: string,toDate?: string): Promise<TransactionListResponseDTO> {
        const result =await this._transactionRepo.getAllTransactions({
            page,
            limit,
            status,
            search,
            fromDate,
            toDate
        })
    return {
      data: result.data.map((t) => ({
        paymentId: t.paymentId,
        orderId: t.orderId,

        companyId: t.companyId,
        companyName: t.companyName,

        planId: t.planId,
        planName: t.planName,

        billingCycle: t.billingCycle,

        amount: t.amount,
        currency: t.currency,

        status: t.status,

        invoiceNumber: t.invoiceNumber ?? null,
        invoiceId:t.invoiceId??null,

        subtotal: t.subtotal ?? null,
        tax: t.tax ?? null,
        total: t.total ?? null,

        createdAt: t.createdAt
      })),

      total: result.total,
      page: result.page,
      limit: result.limit
    };
  }
}