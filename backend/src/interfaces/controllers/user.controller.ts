import { BlockCompanyAdminUseCase } from "../../application/use-cases/user/blockCompanyAdmin.usecase";
import { UnblockCompanyAdminUseCase } from "../../application/use-cases/user/unblockCompanyAdmin.usecase";
import { Request, Response } from "express";
import { handleError } from "../../shared/utils/handleError";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { ListDeveloperUsecase } from "../../application/use-cases/user/listDevelopers.usecase";
import { BlockDeveloperUseCase } from "../../application/use-cases/user/blockDeveloper.usecase";
import { UnblockDeveloperUseCase } from "../../application/use-cases/user/unblockDeveloper.usecase";
import { logger } from "../../shared/logger/logger";


export class UserController {
    constructor(
        private blockCompanyAdminUseCase: BlockCompanyAdminUseCase,
        private unblockCompanyAdminUseCase: UnblockCompanyAdminUseCase,
        private listDeveloperUseCase: ListDeveloperUsecase,
        private blockDeveloperUseCase: BlockDeveloperUseCase,
        private unblockDeveloperUseCase: UnblockDeveloperUseCase
    ) { }
    blockCompanyAdmin = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                logger.warn('Block company admin failed: userId missing');
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER.USER_ID_REQUIRED })
            }
            logger.info('Block company admin requested')

            await this.blockCompanyAdminUseCase.execute(userId);

            logger.info('Company admin blocked successfully');
            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.USER.COMPANY_ADMIN_BLOCKED
            })
        } catch (error: unknown) {
            logger.error('Block company admin failed', { targetUserId: req.params.userId, performedBy: req.user?.id, error });
            return handleError(error, res)
        }
    }

    unblockCompanyAdmin = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                logger.warn('Unblock company admin failed: userId missing');
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER.USER_ID_REQUIRED })
            }
            logger.info('Unblock company admin requested')
            await this.unblockCompanyAdminUseCase.execute(userId);

            logger.info('Company admin unblocked successfully')
            res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.USER.COMPANY_ADMIN_UNBLOCKED
            })
        } catch (error: unknown) {
            logger.error('Unblock company admin failed', { targetUserId: req.params.userId, performedBy: req.user?.id, error });
            return handleError(error, res)
        }
    }
    listDevelopers = async (req: Request, res: Response) => {
        try {
            if (!req.user || req.user.role !== 'COMPANY_ADMIN') {
                logger.warn('List developers failed: forbidden access')
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.FORBIDDEN
                })
            }

            if (!req.user.companyId) {
                logger.warn('List developers failed: company not found')
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.COMPANY.NOT_FOUND
                })
            }

            logger.info('List developers requested')

            const developers = await this.listDeveloperUseCase.execute(req.user.companyId, req.query)

            logger.info('List developers successful')
            const responseItems = developers.items.map(dev => ({
                id: dev.id,
                name: dev.name,
                email: dev.email,
                role: dev.role,
                status: dev.status,
                avatarUrl: dev.avatarUrl,
                createdAt: dev.createdAt,
                updatedAt: dev.updatedAt,
                lastLoginAt: dev.lastLoginAt

            }))

            return res.status(HttpStatus.OK).json({
                success: true,
                data: {
                    items: responseItems,
                    pagination: developers.pagination
                }
            })
        } catch (error: unknown) {
            logger.error('List developers failed', { userId: req.user?.id, companyId: req.user?.companyId, error });
            return handleError(error, res)
        }
    }

    blockDevelopers = async (req: Request, res: Response) => {
        try {
            if (!req.user || req.user.role !== 'COMPANY_ADMIN') {
                logger.warn('Block developer failed: forbidden access')
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.FORBIDDEN
                })
            }
            if (!req.user.companyId) {
                logger.warn('Block developer failed: company not found')
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.COMPANY.NOT_FOUND
                })
            }

            const { userId } = req.params;
            if (!userId) {
                logger.warn('Block developer failed: userId missing')
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER.USER_ID_REQUIRED })
            }


            logger.info('Block developer requested')
            await this.blockDeveloperUseCase.execute(userId, {
                id: req.user.id,
                role: 'COMPANY_ADMIN',
                companyId: req.user.companyId
            })

            logger.info('Developer blocked successfully')

            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.USER.DEVELOPER_BLOCKED
            })

        } catch (error: unknown) {
            logger.error('Block developer failed', { targetUserId: req.params.userId, performedBy: req.user?.id, companyId: req.user?.companyId, error });
            return handleError(error, res)
        }
    }

    unblockDeveloper = async (req: Request, res: Response) => {
        try {
            if (!req.user || req.user.role !== 'COMPANY_ADMIN') {
                logger.warn('Unblock developer failed: forbidden access')
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.FORBIDDEN
                })
            }
            if (!req.user.companyId) {
                logger.warn('Unblock developer failed: company not found')
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.COMPANY.NOT_FOUND
                })
            }

            const { userId } = req.params;
            if (!userId) {
                logger.warn('Unblock developer failed: userId missing')
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER.USER_ID_REQUIRED })
            }

            logger.info('Unblock developer requested')
            await this.unblockDeveloperUseCase.execute(userId, {
                id: req.user.id,
                role: 'COMPANY_ADMIN',
                companyId: req.user.companyId
            })

            logger.info('Developer unblocked successfully')
            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.USER.DEVELOPER_UNBLOCKED
            })

        } catch (error: unknown) {
            logger.error('Unblock developer failed', { targetUserId: req.params.userId, performedBy: req.user?.id, companyId: req.user?.companyId, error });
            return handleError(error, res)
        }
    }
}