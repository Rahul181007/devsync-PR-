import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { PlanSprintRequestDTO } from "../../dto/task/planSprint.dto";
import { IPlanSprintTasksUseCase } from "../../interface/task/IPlanSprintTasksUseCase";

export class PlanSprintTaskUseCase implements IPlanSprintTasksUseCase{
    constructor(
        private _taskRepo:ITaskRepository,
        private _sprintRepo:ISprintRepository,
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository,
        private _userRepo:IUserRepository
    ){}

    async execute(userId: string, companyId: string, projectId: string, data: PlanSprintRequestDTO): Promise<void> {
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

        const project=await this._projectRepo.findById(projectId);
        if(!project){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(project.companyId!==companyId){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const sprint=await this._sprintRepo.findById(data.sprintId);
        if(!sprint){
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(sprint.projectId!==projectId){
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_BELONG_PROJECT,HttpStatus.FORBIDDEN)
        }
        if(sprint.status!=="PLANNED"){
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_PLANNABLE,HttpStatus.BAD_REQUEST)
        }

        for(const item of data.tasks){
            const task=await this._taskRepo.findById(item.taskId);
            if(!task){
                throw new AppError(RESPONSE_MESSAGES.TASK.NOT_FOUND,HttpStatus.NOT_FOUND)
            }
            if(task.projectId!==projectId){
                throw new AppError(RESPONSE_MESSAGES.TASK.TASK_NOT_BELONG_PROJECT,HttpStatus.FORBIDDEN)
            }

            if(task.sprintId!==null){
                throw new AppError(RESPONSE_MESSAGES.TASK.ALREADY_ASSIGNED_TO_SPRINT,HttpStatus.CONFLICT)
            }
           const developer=await this._userRepo.findById(item.developerId);
           if(!developer){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
           }
           if(developer.role!=Role.DEVELOPER){
            throw new AppError(RESPONSE_MESSAGES.TASK.ASSIGNED_USER,HttpStatus.BAD_REQUEST)
           }

           if(developer.companyId!==companyId){
            throw new AppError(RESPONSE_MESSAGES.DEVELOPER.NOT_BELONG_TO_COMPANY,HttpStatus.FORBIDDEN)
           }

           const isMember=await this._projectMemberRepo.isMember(projectId,item.developerId);
           if(!isMember){
            throw new AppError(RESPONSE_MESSAGES.DEVELOPER.NOT_BELONG_TO_PROJECT,HttpStatus.BAD_REQUEST)
           }

           task.sprintId=data.sprintId;
           task.assigneeId=item.developerId

           await this._taskRepo.update(task)
        }
    }
}