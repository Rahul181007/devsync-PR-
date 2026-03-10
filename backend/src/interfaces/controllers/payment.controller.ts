import { Request, Response } from "express";
import { ICreatePaymentUseCase } from "../../application/interface/payment/ICreatePaymentUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { handleError } from "../../shared/utils/handleError";
import { IVerifyPaymentUseCase } from "../../application/interface/payment/IVerifyPaymentUseCase";
import { IGetPaymentHistoryUseCase } from "../../application/interface/payment/IGetPaymentHistoryUseCase";
import { createPaymentSchema } from "../../application/validators/payment/createPayment.validator";
import { verifyPaymentSchema } from "../../application/validators/payment/verifyPayment.validator";

export class PaymentController {
    constructor(
        private _createPaymentUseCase: ICreatePaymentUseCase,
        private _verifyPaymentUseCase: IVerifyPaymentUseCase,
        private _getPaymentHistoryUseCase: IGetPaymentHistoryUseCase
    ) { }

    createPayment = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId

            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const { planId, billingCycle } = createPaymentSchema.parse(req.body);
            const result = await this._createPaymentUseCase.execute({
                userId,
                companyId,
                planId,
                billingCycle
            })

            return res.status(HttpStatus.CREATED).json({
                success: true,
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    verifyPayment = async (req: Request, res: Response) => {
        try {

            const companyId = req.user?.companyId;
            if (!companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
           const { orderId, paymentId, signature } = verifyPaymentSchema.parse(req.body);

            await this._verifyPaymentUseCase.execute({
                orderId,
                paymentId,
                signature,
                companyId
            });

            return res.status(HttpStatus.OK).json({
                success: true,
                message: "Payment verified successfully"
            });

        } catch (error) {
            return handleError(error, res);
        }
    };

    getPaymentHistory = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const result = await this._getPaymentHistoryUseCase.execute({ userId, companyId });
            return res.status(HttpStatus.OK).json({
                success: true,
                data: result
            });
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }
}