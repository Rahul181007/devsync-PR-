import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetSprintDetailResponseDTO } from "../../dto/sprint/getSprintDetailResponse.dto";
import { IGetSprintDetailUseCase } from "../../interface/sprint/IGetSprintDetailUseCase";

export class GetSprintDetailUseCase implements IGetSprintDetailUseCase{
    constructor(
        private _sprintRepo:ISprintRepository,
        private _projectRepo:IProjectRepository,
        private _taskRepo:ITaskRepository,
        private _userRepo:IUserRepository
    ){}

    async execute(userId: string, companyId: string, projectId: string, sprintId: string): Promise<GetSprintDetailResponseDTO> {
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND);
        }
        if(user.role!==Role.COMPANY_ADMIN){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const project=await this._projectRepo.findById(projectId);
        console.log(project)
        if(!project){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(project.companyId!==companyId){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        const sprint=await this._sprintRepo.findById(sprintId);
        if(!sprint){
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }
        if(sprint.projectId!==projectId){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        const allProjectTasks=await this._taskRepo.findByProjectId(projectId);
        const sprintTask=allProjectTasks.filter((task)=>task.sprintId===sprintId)
        return {
            sprint:{
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
            },
            tasks:sprintTask
        }
    }
}