import { Request, Response } from "express";
import { IGetProjectAISummaryUseCase } from "../../application/interface/ai/IGetProjectAISummaryUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { handleError } from "../../shared/utils/handleError";

export class AIController{
    constructor(
        private _getProjectAISummaryUseCase:IGetProjectAISummaryUseCase
    ){}

    getProjectAISummary=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            const companyId=req.user?.companyId;
            const {projectId}=req.params;

            if(!userId || !companyId){
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const summary=await this._getProjectAISummaryUseCase.execute(
                userId,
                companyId,
                projectId
            )

            return res.status(HttpStatus.OK).json({
                success:true,
                data:summary
            })
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }
}