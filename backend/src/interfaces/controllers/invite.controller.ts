import { Request, Response } from "express";
import { inviteSchema } from "../../application/validators/invite/createInvite.validator";
import { handleError } from "../../shared/utils/handleError";
import { verifyInviteQuerySchema } from "../../application/validators/invite/verifyInvite.validator";
import { acceptInviteQuerySchema } from "../../application/validators/invite/acceptInvite.validator";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { inviteDeveloperSchema } from "../../application/validators/invite/inviteDeveloper.validator";
import { logger } from "../../shared/logger/logger";
import { IAcceptInviteUseCase } from "../../application/interface/invite/IAcceptInviteUseCase";
import { ICreateInviteUseCase } from "../../application/interface/invite/ICreateInviteUseCase";
import { IVerifyInviteUseCase } from "../../application/interface/invite/IVerifyInviteUseCase";
import { IInviteDeveloperUseCase } from "../../application/interface/invite/IInviteDeveloperUseCase";
import { Role } from "../../shared/constants/roleenum";



export class InviteController {
    constructor(
        private _createInviteUseCase: ICreateInviteUseCase,
        private _verifyInviteUseCase: IVerifyInviteUseCase,
        private _acceptInviteUseCase: IAcceptInviteUseCase,
        private _inviteDeveloperUseCase: IInviteDeveloperUseCase
    ) { }

    createCompanyAdminInvite = async (req: Request, res: Response) => {
        try {
            const input = inviteSchema.parse(req.body);


            if (!req.user || req.user.role !== Role.SUPER_ADMIN) {
                logger.warn('Create company admin invite failed: forbidden access');
                return res.status(HttpStatus.FORBIDDEN).json({ message: RESPONSE_MESSAGES.AUTH.FORBIDDEN });

            }

            const inviter = {
                id: req.user.id,
                role: Role.SUPER_ADMIN as const
            }

            const { companyId } = req.params

            if (!companyId) {
                logger.warn('Create company admin invite failed: companyId missing');
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.COMPANY.COMPANY_ID })
            }

            const result = await this._createInviteUseCase.execute(input, inviter, companyId)

            logger.info('Company admin invite created successfully')
            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.INVITE.SENT,
                data: {
                    id: result.id,
                    email: result.email,
                    expiresAt: result.expiresAt
                }
            })
        } catch (error: unknown) {
            logger.error('Create company admin invite failed', { userId: req.user?.id, error });
            return handleError(error, res)
        }
    }
    verifyInvite = async (req: Request, res: Response) => {
        try {
            const { token } = req.query
            logger.info('Verify invite requested');
            const parsed = verifyInviteQuerySchema.parse({ token });

            const result = await this._verifyInviteUseCase.execute(parsed.token);

            logger.info('Invite verified successfully');

            res.status(HttpStatus.OK).json({
                message: RESPONSE_MESSAGES.INVITE.VERIFICATION,
                data: result
            })
        } catch (error: unknown) {
            logger.error('Verify invite failed', { error });
            return handleError(error, res)
        }

    }
    acceptInvite = async (req: Request, res: Response) => {
        try {
            logger.info('Accept invite requested');

            const parsed = acceptInviteQuerySchema.parse(req.body)
            const result = await this._acceptInviteUseCase.execute(parsed)
            logger.info('Invite accepted successfully');

            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            })
        } catch (error: unknown) {
            logger.error('Accept invite failed', { error });
            return handleError(error, res)
        }
    }

    inviteDeveloper = async (req: Request, res: Response) => {
        try {
            const parsed = inviteDeveloperSchema.parse(req.body);

            if (!req.user || req.user.role !== Role.COMPANY_ADMIN) {
                logger.warn('Invite developer failed: forbidden access');
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.FORBIDDEN
                })
            }

            if (!req.user.companyId) {
                logger.warn('Invite developer failed: company not found')
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.COMPANY.NOT_FOUND
                })
            }

            logger.info('Invite developer requested');
            const inviter = {
                id: req.user.id,
                role: Role.COMPANY_ADMIN as const,
                companyId: req.user.companyId
            }
            const result = await this._inviteDeveloperUseCase.execute({ email: parsed.email }, inviter)
            logger.info('Developer invited successfully');
            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.INVITE.SENT,
                data: result
            })
        } catch (error: unknown) {
            logger.error('Invite developer failed', { userId: req.user?.id, error });
            return handleError(error, res)
        }
    }
}