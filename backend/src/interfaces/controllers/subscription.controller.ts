import { Request, Response } from "express";
import { IGetCompanySubscriptionUseCase } from "../../application/interface/subscription/IGetCompanySubscriptionUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { handleError } from "../../shared/utils/handleError";

export class SubscriptionController {
    constructor(
        private _getCompanySubscriptionUseCase: IGetCompanySubscriptionUseCase
    ) { }

    getCompanySubscription = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const subscription=await this._getCompanySubscriptionUseCase.execute({companyId,userId});

            return res.status(HttpStatus.OK).json({
                success:true,
                data:subscription
            })
        } catch (error:unknown) {
           return handleError(error,res)
        }
    }
}