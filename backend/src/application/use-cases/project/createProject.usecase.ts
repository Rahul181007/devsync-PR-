import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IMailService } from "../../../domain/service/mail.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { CreateProjectResponse } from "../../dto/project/createProjectResponse.dto";
import { CreateProjectWithMembersDTO } from "../../dto/project/createProjectWithMembers.dto";
import { ICreateProjectUseCase } from "../../interface/project/ICreateProjectUseCase";


export class CreateProjectUseCase implements ICreateProjectUseCase{
    constructor(
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository,
        private _userRepo:IUserRepository,
        private _companyRepo:ICompanyRepository,
        private _mailService:IMailService,
    ){}

    private _generateSlug(name:string):string{
        return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g,"")
        .replace(/\s+/g, "-")
    }

    async execute(userId:string,companyId:string,data:CreateProjectWithMembersDTO):Promise<CreateProjectResponse>{
        const admin=await this._userRepo.findById(userId);

        if(!admin){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(admin.role!==Role.COMPANY_ADMIN){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const company=await this._companyRepo.findById(companyId);

        if(!company){
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        const existingProjecct=await this._projectRepo.findByNameInCompany(companyId,data.name)

        if(existingProjecct){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.ALREADY_EXISTS,
                HttpStatus.CONFLICT
            )
        }

        const project =await this._projectRepo.create({
            companyId,
            name:data.name,
            slug:this._generateSlug(data.name),
            description:data.description??null,
            startDate:data.startDate??null,
            endDate:data.endDate??null,
            status:'ACTIVE',
            createdBy:userId
        })

        await this._projectMemberRepo.create({
            projectId:project.id,
            userId,
            role:'OWNER'
        })

        if(data.members && data.members.length>0){
            const uniqueMemberIds=new Set(
                data.members.map(m=>m.userId)
            )
            for(const memberId of uniqueMemberIds){
                if(memberId===userId) continue;
                const memberUser=await this._userRepo.findById(memberId);

                if(!memberUser){
                    throw new AppError(
                        RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                    )
                }
                if(memberUser.role!=='DEVELOPER'){
                    throw new AppError(
                        RESPONSE_MESSAGES.PROJECT.DEVELOPER_ONLY_BE_ADDED,
                        HttpStatus.BAD_REQUEST
                    )
                }

                if(memberUser.companyId!==companyId){
                    throw new AppError(RESPONSE_MESSAGES.PROJECT.USER_NOT_IN_COMPANY,HttpStatus.FORBIDDEN)
                }

                const isAlreadyMember=await this._projectMemberRepo.isMember(project.id,memberId)
                if(isAlreadyMember) continue;
                await this._projectMemberRepo.create({
                    projectId:project.id,
                    userId:memberId,
                    role:'DEVELOPER'
                })
                await this._mailService.sendDeveloperAddedToProjectEmail({
                    to:memberUser.email,
                    projectName:project.name,
                    companyName:company.name
                })
            }
        }

        return project
    }
}