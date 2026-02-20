import { Request, Response } from "express";
import { ICreateStandupUseCase } from "../../application/interface/standup/ICreateStandupUseCase";
import { createStandupSchema } from "../../application/validators/standup/createStandup.validator";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { handleError } from "../../shared/utils/handleError";
import { IGetMyCurrentSprintStandupsUseCase } from "../../application/interface/standup/IGetMyCurrentSprintStandupsUseCase";
import { IUpdateStandupUseCase } from "../../application/interface/standup/IUpdateStandupUseCase";
import { updateStandupSchema } from "../../application/validators/standup/updateStandup.validator";
import { IGetSprintTodayStandupSummaryUseCase } from "../../application/interface/standup/IGetSprintTodayStandupSummaryUseCase";
import { IGetSprintHistorySummaryUseCase } from "../../application/interface/standup/IGetSprintHistorySummaryUseCase";
import { IGetStandupDetailForCompanyUseCase } from "../../application/interface/standup/IGetStandupDetailForCompanyUseCase";

export class StandupController {
    constructor(
        private _createStandupUseCase: ICreateStandupUseCase,
        private _getMyCurrentSprintStandupsUseCase: IGetMyCurrentSprintStandupsUseCase,
        private _updateStandupUseCase: IUpdateStandupUseCase,
        private _getSprintTodayStandupSummaryUseCase: IGetSprintTodayStandupSummaryUseCase,
        private _getSprintHistorySummaryUseCase: IGetSprintHistorySummaryUseCase,
        private _getStandupDetailUseCase:IGetStandupDetailForCompanyUseCase,
    ) { }

    createStandup = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;

            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const parsed = createStandupSchema.parse(req.body);

            await this._createStandupUseCase.execute(
                userId, companyId, projectId, parsed
            )

            res.status(HttpStatus.CREATED).json({
                success: true,
                message: RESPONSE_MESSAGES.STANDUP.CREATED
            })
        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    getMyCurrentSprintStandups = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;

            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const data = await this._getMyCurrentSprintStandupsUseCase.execute(userId, companyId, projectId)
            return res.status(HttpStatus.OK).json({
                success: true,
                data: data
            })

        } catch (error: unknown) {
            return handleError(error, res)
        }
    }

    updateStandup = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params

            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const parsed = updateStandupSchema.parse(req.body);

            await this._updateStandupUseCase.execute(
                userId,
                companyId,
                projectId,
                parsed
            )

            return res.status(HttpStatus.OK).json({
                success: true,
                message: RESPONSE_MESSAGES.STANDUP.UPDATED
            });
        } catch (error: unknown) {
            return handleError(error, res);
        }
    }

    getSprintTodaySummary = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id;
            const companyId = req.user?.companyId;
            const { projectId } = req.params;
            if (!userId || !companyId) {
                return res.status(HttpStatus.FORBIDDEN).json({
                    message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                });
            }

            const data = await this._getSprintTodayStandupSummaryUseCase.execute(
                userId,
                companyId,
                projectId
            )

            return res.status(HttpStatus.OK).json({
                success: true,
                data:data
            });

        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    getSprintHistorySummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const companyId = req.user?.companyId;
    const { projectId } = req.params;

    if (!userId || !companyId) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
      });
    }

    const data =
      await this._getSprintHistorySummaryUseCase.execute(
        userId,
        companyId,
        projectId
      );

    return res.status(HttpStatus.OK).json({
      success: true,
      data
    });

  } catch (error: unknown) {
    return handleError(error, res);
  }


};
  getStandupDetail=async(req:Request,res:Response)=>{
   try {
     const userId=req.user?.id;
    const companyId=req.user?.companyId;
    const {projectId,standupId}=req.params;

        if (!userId || !companyId) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
      });
    }

    const result =await this._getStandupDetailUseCase.execute(userId,companyId,projectId,standupId)
    res.status(HttpStatus.OK).json({
        success:true,
        data:result
    })
   } catch (error:unknown) {
     return handleError(error,res) 
   }
  }


}