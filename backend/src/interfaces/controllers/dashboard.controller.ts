import { Request, Response } from "express";
import { IGetSuperAdminDashboardUseCase } from "../../application/interface/dashboard/superAdmin/IGetDashboardUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { handleError } from "../../shared/utils/handleError";
import { IGetCompanyDashboardSummaryUseCase } from "../../application/interface/dashboard/companyAdmin/IGetCompanyDashboardSummaryUseCase";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";

export class DashBoardController{
    constructor(
        private _getSuperAdminDashboardUseCase:IGetSuperAdminDashboardUseCase,
        private _getCompanyDashboardSummaryUseCase:IGetCompanyDashboardSummaryUseCase
    ){}

    getDashBoardForSuperAdmin=async(req:Request,res:Response)=>{
        try {
            const result =await this._getSuperAdminDashboardUseCase.execute();

            return res.status(HttpStatus.OK).json({
                success:true,
                data:result
            })
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    getDashboardForCompanyAdmin=async(req:Request,res:Response)=>{
        try {
            const companyId=req.user?.companyId;
                        if (!companyId) {
                            return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.COMPANY.COMPANY_ID });
                        }
            const result =await this._getCompanyDashboardSummaryUseCase.execute(companyId);
            return res.status(HttpStatus.OK).json({
                success:true,
                data:result
            })
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }
}