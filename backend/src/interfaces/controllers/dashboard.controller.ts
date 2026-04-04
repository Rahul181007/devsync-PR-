import { Request, Response } from "express";
import { IGetSuperAdminDashboardUseCase } from "../../application/interface/dashboard/superAdmin/IGetDashboardUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { handleError } from "../../shared/utils/handleError";
import { IGetCompanyDashboardSummaryUseCase } from "../../application/interface/dashboard/companyAdmin/IGetCompanyDashboardSummaryUseCase";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { IGetDeveloperDashboardUseCase } from "../../application/interface/dashboard/developer/getDeveloperDashboard.usecase";

export class DashBoardController {
    constructor(
        private _getSuperAdminDashboardUseCase: IGetSuperAdminDashboardUseCase,
        private _getCompanyDashboardSummaryUseCase: IGetCompanyDashboardSummaryUseCase,
        private _getDeveloperDashboardUseCase: IGetDeveloperDashboardUseCase
    ) { }

    getDashBoardForSuperAdmin = async (req: Request, res: Response) => {
        try {
            const result = await this._getSuperAdminDashboardUseCase.execute();

            return res.status(HttpStatus.OK).json({
                success: true,
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getDashboardForCompanyAdmin = async (req: Request, res: Response) => {
        try {
            const companyId = req.user?.companyId;
            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.COMPANY.COMPANY_ID });
            }
            const result = await this._getCompanyDashboardSummaryUseCase.execute(companyId);
            return res.status(HttpStatus.OK).json({
                success: true,
                data: result
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getDashboardForDeveloper = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const data = await this._getDeveloperDashboardUseCase.execute(userId)
            res.status(200).json({
                success: true,
                data
            });
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }
}