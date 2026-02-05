import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import {  AddProjectMemberDTO } from "../../dto/project/addProjectMember.dto";
import { IAddProjectMemberUseCase } from "../../interface/project/IAddProjectMemberUseCase";

export class AddProjectMemberUseCase implements IAddProjectMemberUseCase{
    constructor(
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository,
        private _userRepo:IUserRepository
    ){}

    async execute(
        adminUserId:string,
        companyId:string,
        projectId:string,
        data:AddProjectMemberDTO
    ){
        const admin =await this._userRepo.findById(adminUserId);

        if(!admin){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(admin.role!=='COMPANY_ADMIN'){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.UNAUTHORIZED
            )
        }
        const project =await this._projectRepo.findById(projectId);

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
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.ARCHIVED,
                HttpStatus.FORBIDDEN
            )
        }

        const userToAdd=await this._userRepo.findById(data.userId);
        if(!userToAdd){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(userToAdd.role!=='DEVELOPER'){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.DEVELOPER_ONLY_BE_ADDED,
                HttpStatus.FORBIDDEN
            )
        }

        if(userToAdd.companyId!==companyId){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.USER_NOT_IN_COMPANY,
                HttpStatus.FORBIDDEN
            )
        }

        const alreadyMember=await this._projectMemberRepo.isMember(
            projectId,
            data.userId
        )

        if(alreadyMember){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_ALREADY_EXISTS,
                HttpStatus.CONFLICT
            )
        }

        await this._projectMemberRepo.create({
            projectId,
            userId:data.userId,
            role:'DEVELOPER'
        })


    }
}