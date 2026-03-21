import { Request, Response } from "express";
import { IAddCommentUseCase } from "../../application/interface/comment/IAddComment.usecase";
import { IGetTaskCommentsUseCase } from "../../application/interface/comment/IGetTaskComments.usecase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { addCommentSchema } from "../../application/validators/comment/addComment.validator";
import { handleError } from "../../shared/utils/handleError";

export class  TaskCommentController{
    constructor(
        private _addCommentUseCase:IAddCommentUseCase,
        private _getTaskCommentUseCase:IGetTaskCommentsUseCase
    ){}

    addComment=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;

      if (!userId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const {projectId,taskId}=req.params;
      const parsed = addCommentSchema.parse(req.body);

      const result =await this._addCommentUseCase.execute(
        userId,{
            projectId,
            taskId,
            message:parsed.message
        }
      )

            return res.status(HttpStatus.CREATED).json({
        success: true,
        data: result,
      });
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    getComments=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
               if (!userId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const {projectId,taskId}=req.params;
      const comments=await this._getTaskCommentUseCase.execute(userId,projectId,taskId)

      return res.status(HttpStatus.OK).json({
        success:true,
        data:comments
      })

        } catch (error:unknown) {
            return handleError(error,res)
        }
    }
}