import { Request, Response } from "express";
import { IGetTaskAttachmentsUseCase } from "../../application/interface/attachment/IGetTaskAttachmentsUseCase";
import { IUploadTaskAttachmentUseCase } from "../../application/interface/attachment/IUploadTaskAttachmentUseCase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { handleError } from "../../shared/utils/handleError";

export class TaskAttachmentController{
    constructor(
     private _uploadAttachmentUseCase: IUploadTaskAttachmentUseCase,
    private _getAttachmentsUseCase: IGetTaskAttachmentsUseCase       
    ){}

    uploadAttachment=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            const companyId=req.user?.companyId;

                  if (!userId || !companyId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const { projectId, taskId } = req.params;

      const file=req.file;

      if(!file){
         return res.status(HttpStatus.BAD_REQUEST).json({
          message: "File is required",
        });       
      }

      const result =await this._uploadAttachmentUseCase.execute(
        userId,
        companyId,
        projectId,taskId,
        {
            buffer:file.buffer,
            originalname:file.originalname,
            mimetype:file.mimetype
        }
      )

      return res.status(HttpStatus.CREATED).json({
        success:true,
        data:result
      })
        } catch (error:unknown) {
            return handleError(error,res)
        }
    }

    getAttachments=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            const companyId=req.user?.companyId;
       if (!userId || !companyId) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      const { projectId, taskId } = req.params;

      const attachments = await this._getAttachmentsUseCase.execute(
        userId,
        companyId,
        projectId,
        taskId
      );           
      return res.status(HttpStatus.OK).json({
        success: true,
        data: attachments,
      });
    } catch (error: unknown) {
      return handleError(error, res);
    }
    }
}