import { CreateCompanyUseCase } from "../../application/use-cases/company/createCompany.usecase";
import { Request, Response } from "express";
import { companySchema } from "../../application/validators/company/createCompany.validator";
import { handleError } from "../../shared/utils/handleError";
import { ListCompaniesUseCase } from "../../application/use-cases/company/listCompanies.usecase";
import { ApproveCompanyUseCase } from "../../application/use-cases/company/approveCompany.usecase";
import { SuspendCompanyUseCase } from "../../application/use-cases/company/suspendCompany.usecase";
import { logger } from "../../shared/logger/logger";



export class CompanyController {
    constructor(
        private createCompanyUseCase: CreateCompanyUseCase,
        private listCompaniesUseCase: ListCompaniesUseCase,
        private approveCompanyUseCase: ApproveCompanyUseCase,
        private suspendCompanyUseCase: SuspendCompanyUseCase
    ) { }
    createCompany = async (req: Request, res: Response) => {
        try {

            logger.info('CreateCompany request recieved by superadmin');

            const parsed = companySchema.parse(req.body);
            if (!req.user || !req.user.id) {
                logger.warn("CreateCompany unauthorized access attempt");
                return res.status(401).json({ message: "Unauthorized" })
            }
            const superAdminId = req.user.id
            const company = await this.createCompanyUseCase.execute({
                ...parsed,
                createdBySuperAdminId: superAdminId
            })
            logger.info(`Company created successfully companyId=${company.id}`);
            res.status(201).json({
                success: true,
                data: company
            })
        } catch (error: unknown) {
            logger.error("CreateCompany failed", error);
            return handleError(error, res, 500, 'Company creatioin failed')
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
            res.status(200).json({
                success: true,
                data: result
            })


        } catch (error: unknown) {
            logger.error("ListCompanies failed", error);
            return handleError(error, res, 500, 'loading of company failed')
        }
    }
    approveCompany = async (req: Request, res: Response) => {
        try {
            const companyId = req.params.id;
            if (!companyId) {
                logger.warn("ApproveCompany called without companyId");
                return res.status(400).json({ message: "Company ID is required" });
            }
            if (!req.user || !req.user.id) {
                logger.warn(`ApproveCompany unauthorized attempt companyId=${companyId}`);

                return res.status(401).json({ message: 'Unauthorized' })
            }

            logger.info(`ApproveCompany started companyId=${companyId} by superAdmin=${req.user.id}`);
            const superAdminId = req.user.id

            await this.approveCompanyUseCase.execute(companyId, superAdminId)
            logger.info(`ApproveCompany success companyId=${companyId}`);
            return res.status(200).json({
                success: true,
                message: 'Company approved successfully'
            })

        } catch (error: unknown) {
            logger.error(`ApproveCompany failed companyId=${req.params.id}`, error);
            return handleError(error, res, 500, 'Company Approval failed')
        }

    }
    suspendCompany = async (req: Request, res: Response) => {
        try {
            const companyId = req.params.id
            if (!companyId) {
                logger.warn("SuspendCompany called without companyId");
                return res.status(400).json({ message: "Company ID is required" });
            }
            if (!req.user || !req.user.id) {
                logger.warn(`SuspendCompany unauthorized attempt companyId=${companyId}`);
                return res.status(401).json({ message: 'Unauthorized' })
            }
            await this.suspendCompanyUseCase.execute(companyId);

            logger.info(`SuspendCompany success companyId=${companyId}`);
            res.status(200).json({
                success: true,
                message: 'Company suspended successfully'
            })
        } catch (error: unknown) {
            logger.error(`SuspendCompany failed companyId=${req.params.id}`, error);
            return handleError(error, res, 500, 'Company suspend failed')
        }
    }
}