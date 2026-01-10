import { BlockCompanyAdminUseCase } from "../../application/use-cases/user/blockCompanyAdmin.usecase";
import { UnblockCompanyAdminUseCase } from "../../application/use-cases/user/unblockCompanyAdmin.usecase";
import { Request, Response } from "express";
import { handleError } from "../../shared/utils/handleError";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { ListDeveloperUsecase } from "../../application/use-cases/user/listDevelopers.usecase";
import { BlockDeveloperUseCase } from "../../application/use-cases/user/blockDeveloper.usecase";
import { UnblockDeveloperUseCase } from "../../application/use-cases/user/unblockDeveloper.usecase";


export class UserController {
    constructor(
        private blockCompanyAdminUseCase: BlockCompanyAdminUseCase,
        private unblockCompanyAdminUseCase: UnblockCompanyAdminUseCase,
        private listDeveloperUseCase: ListDeveloperUsecase,
        private blockDeveloperUseCase:BlockDeveloperUseCase,
        private unblockDeveloperUseCase:UnblockDeveloperUseCase
    ) { }
    blockCompanyAdmin = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER.USER_ID_REQUIRED })
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
    listDevelopers = async (req: Request, res: Response) => {
        try {
            if (!req.user || req.user.role !== 'COMPANY_ADMIN') {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.FORBIDDEN
                })
            }

            if (!req.user.companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: RESPONSE_MESSAGES.COMPANY.NOT_FOUND
                })
            }

            const developers = await this.listDeveloperUseCase.execute({
                id: req.user.id,
                role: 'COMPANY_ADMIN',
                companyId: req.user.companyId
            })
            const response = developers.map(dev => ({
                id: dev.id,
                companyId: dev.companyId,
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
                data: response
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    blockDevelopers=async(req:Request,res:Response)=>{
        try {
            if(!req.user || req.user.role!=='COMPANY_ADMIN'){
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.FORBIDDEN
                })
            }
            if(!req.user.companyId){
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message:RESPONSE_MESSAGES.COMPANY.NOT_FOUND
                })
            }

            const {userId}=req.params;
            if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER.USER_ID_REQUIRED })
            }

            await this.blockDeveloperUseCase.execute(userId,{
                id:req.user.id,
                role:'COMPANY_ADMIN',
                companyId:req.user.companyId
            })

            return res.status(HttpStatus.OK).json({
                success:true,
                message:RESPONSE_MESSAGES.USER.DEVELOPER_BLOCKED
            })

        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    unblockDeveloper=async(req:Request,res:Response)=>{
        try {
            if(!req.user || req.user.role!=='COMPANY_ADMIN'){
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.FORBIDDEN
                })
            }
            if(!req.user.companyId){
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message:RESPONSE_MESSAGES.COMPANY.NOT_FOUND
                })
            }

            const {userId}=req.params;
             if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER.USER_ID_REQUIRED })
            }

            await this.unblockDeveloperUseCase.execute(userId,{
                id:req.user.id,
                role:'COMPANY_ADMIN',
                companyId:req.user.companyId
            })

            return res.status(HttpStatus.OK).json({
                success:true,
                message:RESPONSE_MESSAGES.USER.DEVELOPER_UNBLOCKED
            })

        } catch (error:unknown) {
            return handleError(error,res)
        }
    }
}