import { IGetTransactionsUseCase } from "../application/interface/transaction/IGetTransactionsUseCase";
import { GetTransactionsUseCase } from "../application/use-cases/transaction/getTransactions.usecase";
import { TransactionQueryRepository } from "../infrastructure/repositories/transaction.query.repository";
import { TransactionController } from "../interfaces/controllers/transaction.controller";

const transactionQueryRepository =new TransactionQueryRepository();

export const getTransactionsUseCase: IGetTransactionsUseCase =new GetTransactionsUseCase(transactionQueryRepository);

export const transactionController = new TransactionController(
  getTransactionsUseCase
);
