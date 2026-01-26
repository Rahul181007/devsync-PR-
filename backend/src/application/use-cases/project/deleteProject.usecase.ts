import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class DeleteProjectUseCase {
    constructor(
        private  _projectRepo:IProjectRepository,
        private _userRepo:IUserRepository,
        private _projectMemberRepo:IProjectMemberRepository
    ){}

    async execute (
        userId:string,
        companyId:string,
        projectId:string
    ):Promise<void>{
      
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(user.role!=='COMPANY_ADMIN'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const project =await this._projectRepo.findById(projectId)

        if(!project){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,HttpStatus.NOT_FOUND)

        }

        if(project.companyId!==companyId){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }
       
        if(project.status==='ARCHIVED'){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.ARCHIVED,HttpStatus.FORBIDDEN)
        }
        await this._projectMemberRepo.deleteByProject(projectId)
       await this._projectRepo.delete(projectId)
       


    }
}