import { Request, Response } from "express";
import { IGetInvoiceUseCase } from "../../application/interface/invoice/IGetInvoiceUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { handleError } from "../../shared/utils/handleError";

export class InvoiceController {
    constructor(
        private _getInvoiceUseCase: IGetInvoiceUseCase
    ) { }

    downloadInvoice = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { invoiceId } = req.params;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const pdfBuffer = await this._getInvoiceUseCase.execute(userId, companyId, invoiceId);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=invoice.pdf`
            );
            return res.status(HttpStatus.OK).send(pdfBuffer);
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }
}