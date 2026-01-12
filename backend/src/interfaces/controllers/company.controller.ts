import { CreateCompanyUseCase } from "../../application/use-cases/company/createCompany.usecase";
import { Request, Response } from "express";
import { companySchema } from "../../application/validators/company/createCompany.validator";
import { handleError } from "../../shared/utils/handleError";
import { ListCompaniesUseCase } from "../../application/use-cases/company/listCompanies.usecase";
import { ApproveCompanyUseCase } from "../../application/use-cases/company/approveCompany.usecase";
import { SuspendCompanyUseCase } from "../../application/use-cases/company/suspendCompany.usecase";
import { logger } from "../../shared/logger/logger";
import { GetCompanyIdUseCase } from "../../application/use-cases/company/getCompanyById.usecase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { CreateWorkspaceUseCase } from "../../application/use-cases/company/createWorkspace.usecase";
import { createWorkspaceSchema } from "../../application/validators/company/createWorkspace.validator";
import { GetMyCompanyUseCase } from "../../application/use-cases/company/getMyCompany.usecase";
import { updateCompanyBrandingSchema } from "../../application/validators/company/updateBranding.validator";
import { UpdateCompanyBrandingUseCase } from "../../application/use-cases/company/updateCompanyBranding.usecase";
import { Tokenutilits } from "../../shared/utils/token.util";




export class CompanyController {
    constructor(
        private createCompanyUseCase: CreateCompanyUseCase,
        private listCompaniesUseCase: ListCompaniesUseCase,
        private approveCompanyUseCase: ApproveCompanyUseCase,
        private suspendCompanyUseCase: SuspendCompanyUseCase,
        private getCompanyByIdUseCase: GetCompanyIdUseCase,
        private createWorkspaceUseCase: CreateWorkspaceUseCase,
        private getMyCompanyUseCase: GetMyCompanyUseCase,
        private updateCompanyBrandingUseCase: UpdateCompanyBrandingUseCase
    ) { }
    createCompany = async (req: Request, res: Response) => {
        try {

            logger.info('CreateCompany request recieved by superadmin');

            const parsed = companySchema.parse(req.body);


            if (!req.user || !req.user.id) {
                logger.warn("CreateCompany unauthorized access attempt");
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED })
            }
            const superAdminId = req.user.id
            const company = await this.createCompanyUseCase.execute({
                ...parsed,
                createdBySuperAdminId: superAdminId
            })
            logger.info(`Company created successfully companyId=${company.id}`);
            res.status(HttpStatus.CREATED).json({
                success: true,
                data: company
            })
        } catch (error: unknown) {
            logger.error("CreateCompany failed", error);
            return handleError(error, res)
        }
    }
    listCompanies = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10
            const status = req.query.status as | 'PENDING' | 'APPROVED' | 'SUSPENDED' | undefined;

            const search = typeof req.query.search === 'string' ? req.query.search : undefined;

            logger.info(`ListCompanies request page=${page} limit=${limit} status=${status}`);
            const result = await this.listCompaniesUseCase.execute({
                page,
                limit,
                status,
                search
            })
            res.status(HttpStatus.OK).json({
                success: true,
                data: result
            })


        } catch (error: unknown) {
            logger.error("ListCompanies failed", error);
            return handleError(error, res)
        }
    }
    approveCompany = async (req: Request, res: Response) => {
        try {
            const companyId = req.params.id;
            if (!companyId) {
                logger.warn("ApproveCompany called without companyId");
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.COMPANY.COMPANY_ID });
            }
            if (!req.user || !req.user.id) {
                logger.warn(`ApproveCompany unauthorized attempt companyId=${companyId}`);

                return res.status(HttpStatus.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED })
            }

            logger.info(`ApproveCompany started companyId=${companyId} by superAdmin=${req.user.id}`);
            const superAdminId = req.user.id

            await this.approveCompanyUseCase.execute(companyId, superAdminId)
            logger.info(`ApproveCompany success companyId=${companyId}`);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.COMPANY.APPROVED
            })

        } catch (error: unknown) {
            logger.error(`ApproveCompany failed companyId=${req.params.id}`, error);
            return handleError(error, res)
        }

    }
    suspendCompany = async (req: Request, res: Response) => {
        try {
            const companyId = req.params.id
            if (!companyId) {
                logger.warn("SuspendCompany called without companyId");
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.COMPANY.COMPANY_ID });
            }
            if (!req.user || !req.user.id) {
                logger.warn(`SuspendCompany unauthorized attempt companyId=${companyId}`);
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED })
            }
            await this.suspendCompanyUseCase.execute(companyId);

            logger.info(`SuspendCompany success companyId=${companyId}`);
            res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.COMPANY.SUSPENDED
            })
        } catch (error: unknown) {
            logger.error(`SuspendCompany failed companyId=${req.params.id}`, error);
            return handleError(error, res)
        }
    }

    getCompanyById = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            if (!companyId) {
                logger.warn('Get company failed: companyId is missing');
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.COMPANY.COMPANY_ID })
            }
            logger.info(`Fetching company with id: ${companyId}`);
            const company = await this.getCompanyByIdUseCase.execute(companyId);
            logger.info('getting a company was succesful')
            return res.status(HttpStatus.OK).json({
                success: true,
                data: company
            })
        } catch (error: unknown) {
            logger.error('Get company failed', { companyId: req.params.companyId, error });
            return handleError(error, res)
        }
    }

    createWorkspace = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                logger.warn('Create workspace failed: unauthorized access attempt');
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            logger.info(`Create workspace requested | userId: ${userId}`);
            const parsed = createWorkspaceSchema.parse(req.body);

            const result = await this.createWorkspaceUseCase.execute(userId, parsed);

            logger.info(`Workspace created successfully by user ${userId}`);
            const newAccessToken = Tokenutilits.generateAccessToken({
                sub: result.userId,
                role: result.role,
                companyId: result.companyId
            })

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                path: "/",
            });
            return res.status(HttpStatus.CREATED).json({
                message: RESPONSE_MESSAGES.COMPANY.WORKSPACE_CREATED,
                data: {
                    companyId: result.companyId
                }

            })

        } catch (error: unknown) {
            logger.error('Create workspace failed', { userId: req.user?.id, error });
            return handleError(error, res)
        }
    }

    getMyCompany = async (req: Request, res: Response) => {
        try {
            const companyId = req.user?.companyId

            if (!companyId) {
                 logger.warn('Get my company failed: companyId missing in user context')
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.COMPANY_NOT_FOUND
                })
            }
            
            logger.info(`Get my company requested | companyId: ${companyId}`);

            const company = await this.getMyCompanyUseCase.execute(companyId);
             logger.info(`Get my company successful | companyId: ${companyId}`);

            return res.status(HttpStatus.OK).json({
                data: company
            })

        } catch (error: unknown) {
                    logger.error('Get my company failed', {companyId: req.user?.companyId,error});
            return handleError(error, res)
        }
    }

    updateBranding = async (req: Request, res: Response) => {
        try {
            const companyId = req.user?.companyId
            if (!companyId) {
                logger.warn('Update branding failed: unauthorized access');
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    message: RESPONSE_MESSAGES.AUTH.COMPANY_NOT_FOUND
                })
            }

            logger.info(`Update branding requested | companyId: ${companyId}`);
            const parsed = updateCompanyBrandingSchema.parse(req.body);

            await this.updateCompanyBrandingUseCase.execute(companyId, {
                ...parsed,
                logoFile: req.file?.buffer,
                logoMimeType: req.file?.mimetype,
            })
             logger.info(`Branding updated successfully | companyId: ${companyId}`);

            return res.status(HttpStatus.OK).json({
                message: RESPONSE_MESSAGES.COMPANY.BRANDING_UPDATED
            })
        } catch (error: unknown) {
                    logger.error('Update branding failed', {companyId: req.user?.companyId,error});
            return handleError(error, res)
        }
    }
}