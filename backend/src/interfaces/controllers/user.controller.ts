import { BlockCompanyAdminUseCase } from "../../application/use-cases/user/blockCompanyAdmin.usecase";
import { UnblockCompanyAdminUseCase } from "../../application/use-cases/user/unblockCompanyAdmin.usecase";
import { Request, Response } from "express";
import { handleError } from "../../shared/utils/handleError";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";

export class UserController {
    constructor(
        private blockCompanyAdminUseCase: BlockCompanyAdminUseCase,
        private unblockCompanyAdminUseCase: UnblockCompanyAdminUseCase
    ) { }
    blockCompanyAdmin = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message:RESPONSE_MESSAGES.USER.USER_ID_REQUIRED})
            }
            await this.blockCompanyAdminUseCase.execute(userId);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.USER.COMPANY_ADMIN_BLOCKED
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    unblockCompanyAdmin = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                 return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER.USER_ID_REQUIRED })
            }
            await this.unblockCompanyAdminUseCase.execute(userId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.USER.COMPANY_ADMIN_UNBLOCKED
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }
}