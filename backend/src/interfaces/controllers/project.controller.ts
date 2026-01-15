import { Request, Response } from "express";
import { CreateFirstProjectUseCase } from "../../application/use-cases/project/createFirstProject.usecase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { createProjectSchema } from "../../application/validators/project/createProject.validator";
import { handleError } from "../../shared/utils/handleError";
import { logger } from "../../shared/logger/logger";

export class ProjectController{
    constructor(
        private _createFirstProjectUseCase:CreateFirstProjectUseCase
    ){}

    createFirstProject=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            const companyId=req.user?.companyId;

            if(!userId||!companyId){
                logger.warn('Create first project failed: unauthorized access')
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }
            logger.info('Create first project requested')

            const parsed= createProjectSchema.parse(req.body)

            const project =await this._createFirstProjectUseCase.execute(userId,companyId,parsed)

            logger.info('First project created successfully');

            return res.status(HttpStatus.CREATED).json({
                message:RESPONSE_MESSAGES.PROJECT.CREATED,
                data:{
                    id:project.id,
                    name:project.name,
                    slug:project.slug
                }
            })
        } catch (error:unknown) {
             logger.error('Create first project failed', {userId: req.user?.id,companyId: req.user?.companyId,error});
           return handleError(error,res) 
        }
    }
}