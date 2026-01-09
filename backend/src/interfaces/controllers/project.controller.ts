import { Request, Response } from "express";
import { CreateFirstProjectUseCase } from "../../application/use-cases/project/createFirstProject.usecase";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../shared/constants/responseMessages";
import { createProjectSchema } from "../../application/validators/project/createProject.validator";
import { handleError } from "../../shared/utils/handleError";

export class ProjectController{
    constructor(
        private createFirstProjectUseCase:CreateFirstProjectUseCase
    ){}

    createFirstProject=async(req:Request,res:Response)=>{
        try {
            const userId=req.user?.id;
            const companyId=req.user?.companyId;

            if(!userId||!companyId){
                return res.status(HttpStatus.FORBIDDEN).json({
                    message:RESPONSE_MESSAGES.AUTH.UNAUTHORIZED
                })
            }

            const parsed= createProjectSchema.parse(req.body)

            const project =await this.createFirstProjectUseCase.execute(userId,companyId,parsed)

            return res.status(HttpStatus.CREATED).json({
                message:RESPONSE_MESSAGES.PROJECT.CREATED,
                data:{
                    id:project.id,
                    name:project.name,
                    slug:project.slug
                }
            })
        } catch (error:unknown) {
           return handleError(error,res) 
        }
    }
}