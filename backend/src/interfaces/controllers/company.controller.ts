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




export class CompanyController {
    constructor(
        private createCompanyUseCase: CreateCompanyUseCase,
        private listCompaniesUseCase: ListCompaniesUseCase,
        private approveCompanyUseCase: ApproveCompanyUseCase,
        private suspendCompanyUseCase: SuspendCompanyUseCase,
        private getCompanyByIdUseCase:GetCompanyIdUseCase
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
                return res.status(HttpStatus.BAD_REQUEST).json({ message:RESPONSE_MESSAGES.COMPANY.COMPANY_ID });
            }
            if (!req.user || !req.user.id) {
                logger.warn(`ApproveCompany unauthorized attempt companyId=${companyId}`);

                return res.status(HttpStatus.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED})
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
                return res.status(HttpStatus.BAD_REQUEST).json({ message:RESPONSE_MESSAGES.COMPANY.COMPANY_ID });
            }
            if (!req.user || !req.user.id) {
                logger.warn(`SuspendCompany unauthorized attempt companyId=${companyId}`);
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED})
            }
            await this.suspendCompanyUseCase.execute(companyId);

            logger.info(`SuspendCompany success companyId=${companyId}`);
            res.status(HttpStatus.OK).json({
                success: true,
                message:RESPONSE_MESSAGES.COMPANY.SUSPENDED
            })
        } catch (error: unknown) {
            logger.error(`SuspendCompany failed companyId=${req.params.id}`, error);
            return handleError(error, res)
        }
    }

    getCompanyById=async(req:Request,res:Response)=>{
        try {
            const {companyId}=req.params;
            if(!companyId){
                return res.status(HttpStatus.BAD_REQUEST).json({message:RESPONSE_MESSAGES.COMPANY.COMPANY_ID})
            }

            const company=await this.getCompanyByIdUseCase.execute(companyId);

            return res.status(HttpStatus.OK).json({
                success:true,
                data:company
            })
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }
}