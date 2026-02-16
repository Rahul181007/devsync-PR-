import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { CreateSprintRequestDTO } from "../../dto/sprint/createSprintRequest.dto";
import { SprintResponseDTO } from "../../dto/sprint/sprintResponse.dto";
import { ICreateSprintUseCase } from "../../interface/sprint/ICreateSprintUseCase";

export class CreateSprintUseCase implements ICreateSprintUseCase{
    constructor(
        private _sprintRepo:ISprintRepository,
        private _projectRepo:IProjectRepository,
        private _userRepo: IUserRepository
    ){}

    async execute(userId: string, companyId: string, projectId: string,data:CreateSprintRequestDTO): Promise<SprintResponseDTO> {
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }
        if(user.role!==Role.COMPANY_ADMIN){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }
        const project= await this._projectRepo.findById(projectId);
        if(!project){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }
        if(project.companyId!==companyId){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        if(project.status==="ARCHIVED"|| project.status==="COMPLETED"){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.ARCHIVED,
                HttpStatus.FORBIDDEN
            )
        }
   
        const existingSprints=await this._sprintRepo.findByProjectId(projectId);
        const duplicate=existingSprints.find((s)=>s.name.toLowerCase()===data.name.toLowerCase())
        
        if(duplicate){
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NAME_EXISTS,
                HttpStatus.CONFLICT
            )
        }
        const overlapping=existingSprints.find(
            (s)=>
                s.startDate<=data.endDate &&
                s.endDate>=data.startDate
        )

        if(overlapping){
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_DATE_OVERLAP,HttpStatus.CONFLICT
            )
        }





        const sprint=await this._sprintRepo.create({
            projectId,
            companyId,
            name:data.name,
            goal:data.goal?? null,
            startDate:data.startDate,
            endDate:data.endDate,
            status:"PLANNED",
            createdBy:userId
        })

        return {
            id:sprint.id,
            projectId:sprint.projectId,
            name:sprint.name,
            goal:sprint.goal,
            startDate:sprint.startDate,
            endDate:sprint.endDate,
            status:sprint.status,
            createdBy:sprint.createdBy,
            createdAt:sprint.createdAt,
            updatedAt:sprint.updatedAt
        }
    }
}