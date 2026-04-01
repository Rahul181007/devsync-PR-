import { Request, Response } from "express";
import { IGetSuperAdminDashboardUseCase } from "../../application/interface/dashboard/superAdmin/IGetDashboardUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { handleError } from "../../shared/utils/handleError";

export class DashBoardController{
    constructor(
        private _getSuperAdminDashboardUseCase:IGetSuperAdminDashboardUseCase
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
}