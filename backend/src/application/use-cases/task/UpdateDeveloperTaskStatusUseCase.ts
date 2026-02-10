import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateDeveloperTaskStatus } from "../../dto/task/UpdateDeveloperTaskStatus.dto";
import { IUpdateDeveloperTaskStatusUseCase } from "../../interface/task/IUpdateDeveloperTaskStatusUseCase";

export class UpdateDeveloperTaskStatusUseCase implements IUpdateDeveloperTaskStatusUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _taskRepo:ITaskRepository,
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository
    ){}

    async execute(userId: string, projectId: string, taskId: string, data: UpdateDeveloperTaskStatus): Promise<void> {
        const user=await this._userRepo.findById(userId);

        if(!user || user.role!==Role.DEVELOPER){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const project=await this._projectRepo.findById(projectId);
        if(!project || project.companyId!==user.companyId){
            throw new  AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const isMember=await this._projectMemberRepo.isMember(projectId,userId);
        if(!isMember){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.FORBIDDEN
            )
        }
        const task =await this._taskRepo.findById(taskId);
        if(!task || task.projectId!==projectId){
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }
        if(task.assigneeId!==userId){
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_ASSIGNED_TO_YOU,
                HttpStatus.FORBIDDEN
            )
        }

        if(!task.sprintId){
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_IN_SPRINT,
                HttpStatus.BAD_REQUEST
            )
        }

        if(task.sprintId!==project.currentSprintId){
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_IN_ACTIVE_SPRINT,
                HttpStatus.BAD_REQUEST

            )
        }

        const isValidTransition=
        (task.status==="BACKLOG"&& data.status==="TODO")||(task.status==="TODO" && data.status==="IN_PROGRESS")
        if(!isValidTransition){
            throw new AppError(
                RESPONSE_MESSAGES.TASK.INVALID_STATUS_TRANSITION,
                HttpStatus.BAD_REQUEST
            )
        }

        task.status=data.status;
        await this._taskRepo.update(task)
    }
}