import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class GetProjectDetailUseCase {
    constructor(
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository,
        private  _userRepo:IUserRepository
    ){}

    async execute(userId:string,companyId:string,projectId:string){
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND);
        }
         
        const project=await this._projectRepo.findById(projectId);

        if(!project){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(project.companyId!==companyId){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        if(user.role==='COMPANY_ADMIN'){
            return project
        }
        if(user.role==='DEVELOPER'){
            const isMember=await this._projectMemberRepo.isMember(
                projectId,
                userId
            )
            if(!isMember){
               throw new AppError(
                RESPONSE_MESSAGES.PROJECT.ACCESS_DENIED,
                HttpStatus.FORBIDDEN
               )
            }
            return project
        }

        throw new AppError(
            RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
            HttpStatus.FORBIDDEN
        )
    }
}