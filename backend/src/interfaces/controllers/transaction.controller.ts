import { Request, Response } from "express";
import { IGetTransactionsUseCase } from "../../application/interface/transaction/IGetTransactionsUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { handleError } from "../../shared/utils/handleError";
import { getTransactionsSchema } from "../../application/validators/transaction/getTransactions.validator";

export class TransactionController {
    constructor(
        private _getTransactionsUseCase: IGetTransactionsUseCase
    ) { }

    getAllTransactions = async (req: Request, res: Response) => {
        try {
            const parsed = getTransactionsSchema.parse(req.query);

            const result = await this._getTransactionsUseCase.execute(
                parsed.page,
                parsed.limit,
                parsed.status,
                parsed.search,
                parsed.fromDate,
                parsed.toDate
            )

            return res.status(HttpStatus.OK).json({
                success: true,
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }


}