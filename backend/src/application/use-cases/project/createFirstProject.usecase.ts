import { ICompanyRepository } from "../../../domain/repositories/company.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { CreateProjectDTO } from "../../dto/project/createProject.dto";

export class CreateFirstProjectUseCase {
    constructor(
        private projectRepo:IProjectRepository,
        private projectMember:IProjectMemberRepository,
        private companyRepo:ICompanyRepository,
        private userRepo:IUserRepository  
    ){}

     private _generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  async execute(userId:string,companyId:string,data:CreateProjectDTO){
    const user=await this.userRepo.findById(userId);

    if(!user){
        throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
    }

    if(user.role!=='COMPANY_ADMIN'){
        throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
    }

    const company=await this.companyRepo.findById(companyId);

    if(!company){
        throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND,HttpStatus.NOT_FOUND)
    }

    const existing=await this.projectRepo.findByNameInCompany(companyId,data.name)
    
    if(existing){
        throw new AppError(RESPONSE_MESSAGES.PROJECT.ALREADY_EXISTS,HttpStatus.CONFLICT)
    }
    const project =await this.projectRepo.create({
        companyId,
        name:data.name,
        slug:this._generateSlug(data.name),
        description:data.description,
        startDate:data.startDate,
        endDate:data.endDate,
        status:'ACTIVE',
        createdBy:userId
    })

    await this.projectMember.create({
        projectId:project.id,
        userId,
        role:'OWNER'
    })
    return project
  } 
}