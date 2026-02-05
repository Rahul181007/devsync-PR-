import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { IRemoveProjectMemberUseCase } from "../../interface/project/IRemoveProjectMemberUseCase";


export class RemoveProjectMemberUseCase implements IRemoveProjectMemberUseCase{
    constructor(
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository,
        private _userRepo:IUserRepository
    ){}

    async execute(
        adminUserId:string,
        companyId:string,
        projectId:string,
        memberId:string,
    ){
        const admin=await this._userRepo.findById(adminUserId);
        if(!admin){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }

        if(admin.role!=='COMPANY_ADMIN'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
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

        if(project.status==='ARCHIVED'){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.ARCHIVED,HttpStatus.FORBIDDEN)
        }

            if (memberId === adminUserId) {
      throw new AppError(
        RESPONSE_MESSAGES.PROJECT.CANNOT_REMOVE_OWNER,
        HttpStatus.BAD_REQUEST
      );
    }

        const userToRemove=await this._userRepo.findById(memberId);
        if(!userToRemove){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        const isMember=await this._projectMemberRepo.isMember(
            projectId,
            memberId
        )

        if(!isMember){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        await this._projectMemberRepo.remove(
            projectId,
            memberId
        )
    }
}