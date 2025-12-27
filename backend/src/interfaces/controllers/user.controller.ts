import { BlockCompanyAdminUseCase } from "../../application/use-cases/user/blockCompanyAdmin.usecase";
import { UnblockCompanyAdminUseCase } from "../../application/use-cases/user/unblockCompanyAdmin.usecase";
import { Request, Response } from "express";
import { handleError } from "../../shared/utils/handleError";

export class UserController {
    constructor(
        private blockCompanyAdminUseCase: BlockCompanyAdminUseCase,
        private unblockCompanyAdminUseCase: UnblockCompanyAdminUseCase
    ) { }
    blockCompanyAdmin = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: 'userId is required' })
            }
            await this.blockCompanyAdminUseCase.execute(userId);
            return res.status(200).json({
                success: true,
                message: 'Company admin was blocked successfully'
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    unblockCompanyAdmin = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                 return res.status(400).json({ message: 'userid is required' })
            }
            await this.unblockCompanyAdminUseCase.execute(userId);
            res.status(200).json({
                success: true,
                message: 'Company admin was unblocked'
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }
}