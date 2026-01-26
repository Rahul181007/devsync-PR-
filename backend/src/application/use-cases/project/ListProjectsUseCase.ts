import { ProjectStatus } from "../../../domain/entities/project.entity";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

interface ListProjectInput {
    page:number;
    limit:number;
    search?:string;
    status?:ProjectStatus
}


export class ListProjectsUseCase {
    constructor(
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository,
        private _userRepo:IUserRepository
    ){}

    async execute (userId:string, companyId:string,input:ListProjectInput){
        const user=await this._userRepo.findById(userId);

        if(!user){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(user.role==='COMPANY_ADMIN'){
            const result =await this._projectRepo.findAllByCompany(companyId,input);

            return {
                data:result.data,
                total:result.total,
                page:input.page,
                limit:input.limit
            }
        }

        if(user.role==='DEVELOPER'){
            const projectIds=await this._projectMemberRepo.findUserProjects(userId);

            if(projectIds.length===0){
                return {
                    data:[],
                    total:0,
                    page:input.page,
                    limit:input.limit,
                }
            }
            const result =await this._projectRepo.findAllByCompany(companyId,{
                ...input,
                projectIds
            })

            return {
                data:result.data,
                total:result.total,
                page:input.page,
                limit:input.limit
            }
        }
        throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
    }
}