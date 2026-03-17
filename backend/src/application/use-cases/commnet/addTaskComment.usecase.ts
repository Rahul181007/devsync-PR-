import { ICommentRepository } from "../../../domain/repositories/comment.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { AddCommentRequestDTO } from "../../dto/comment/addCommentRequest.dto";
import { CommentResponseDTO } from "../../dto/comment/commentResponse.dto";
import { IAddCommentUseCase } from "../../interface/comment/IAddComment.usecase";

export class AddTaskCommentUseCase implements IAddCommentUseCase{
    constructor(
        private _commentRepo:ICommentRepository,
        private _taskRepo:ITaskRepository,
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository,
        private _userRepo:IUserRepository
    ){}

    async execute(userId: string, data: AddCommentRequestDTO): Promise<CommentResponseDTO> {
        const user=await this._userRepo.findById(userId);

        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND);
        }
       
        const project=await this._projectRepo.findById(data.projectId);

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

        const isMember=await this._projectMemberRepo.isMember(
            data.projectId,
            userId
        )
        if(!isMember){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.FORBIDDEN
            )
        }

        const task=await this._taskRepo.findById(data.taskId);

        if(!task){
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(task.projectId!==data.projectId){
            throw new AppError(
                RESPONSE_MESSAGES.TASK.TASK_NOT_BELONG_PROJECT,
                HttpStatus.FORBIDDEN
            )
        }

        const comment =await this._commentRepo.create({
            taskId:task.id,
            userId:user.id,
            message:data.message.trim()
        })

        return {
            id:comment.id,
            taskId:comment.taskId,
            userId:comment.userId,
            message:comment.message,
            createdAt:comment.createdAt,
        }
    }
}