import { Request, Response } from "express";
import { IGetProjectMessageUseCase } from "../../application/interface/chat/IGetProjectMessagesUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { getProjectMessagesSchema } from "../../application/validators/chat/getProjectMessages.validator";
import { handleError } from "../../shared/utils/handleError";

export class ChatController {
    constructor(
        private _getProjectMessageUseCase: IGetProjectMessageUseCase
    ) { }

    getProjectMessage = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }
            const parsed=getProjectMessagesSchema.parse({
                limit:Number(req.query.limit),
                cursor:req.query.cursor
            })

            const message=await this._getProjectMessageUseCase.execute(userId,companyId,projectId,parsed)

            return res.status(HttpStatus.OK).json({
                success:true,
                data:message
            })
        } catch (error:unknown) {
           return handleError(error,res)
        }
    }
}