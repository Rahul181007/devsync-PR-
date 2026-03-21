import { ICommentRepository } from "../../../domain/repositories/comment.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { GetCommentResponseDTO } from "../../dto/comment/commentResponse.dto";
import { IGetTaskCommentsUseCase } from "../../interface/comment/IGetTaskComments.usecase";

export class GetTaskCommentsUseCase implements IGetTaskCommentsUseCase{
    constructor(
        private _commentRepo:ICommentRepository,
        private _taskRepo:ITaskRepository,
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository,
        private _userRepo:IUserRepository
    ){}

async execute(userId: string, projectId: string, taskId: string): Promise<GetCommentResponseDTO[]> {
    const user=await this._userRepo.findById(userId);

    if(!user){
        throw new AppError(
            RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
            HttpStatus.NOT_FOUND
        )
    }

    const project=await this._projectRepo.findById(projectId);
    if(!project){
        throw new AppError(
            RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
            HttpStatus.NOT_FOUND
        )
    }

    if(project.companyId!==user.companyId){
        throw new AppError(
            RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
            HttpStatus.FORBIDDEN
        )
    }

    const isMember=await this._projectMemberRepo.isMember(projectId,userId)

    if(!isMember){
        throw new AppError(
            RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
            HttpStatus.FORBIDDEN
        )
    }

    const task=await this._taskRepo.findById(taskId);
    if(!task){
        throw new AppError(
            RESPONSE_MESSAGES.TASK.NOT_FOUND,
            HttpStatus.NOT_FOUND
        )
    }

    if(task.projectId!==projectId){
        throw new AppError(
            RESPONSE_MESSAGES.TASK.TASK_NOT_BELONG_PROJECT,
            HttpStatus.FORBIDDEN
        )
    }

    const comments=await this._commentRepo.findByTaskIdWithUser(taskId);

    return comments.map((c)=>({
        id:c.id,
        taskId:c.taskId,
        userId:c.userId,
        userName:c.userName,
        message:c.message,
        createdAt:c.createdAt
    }))
}
}