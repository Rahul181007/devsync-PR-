import { ITaskAttachmentRepository } from "../../../domain/repositories/attachment.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { TaskAttachmentResponseDTO } from "../../dto/attachment/taskAttachmentResponse.dto";
import { IGetTaskAttachmentsUseCase } from "../../interface/attachment/IGetTaskAttachmentsUseCase";

export class GetTaskAttachmentsUseCase implements IGetTaskAttachmentsUseCase {
    constructor(
        private _attachmentRepo: ITaskAttachmentRepository,
        private _taskRepo: ITaskRepository,
        private _projectRepo: IProjectRepository,
        private _userRepo: IUserRepository,
        private _projectMemberRepo: IProjectMemberRepository
    ) { }

    async execute(userId: string, companyId: string, projectId: string, taskId: string): Promise<TaskAttachmentResponseDTO[]> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const project = await this._projectRepo.findById(projectId);

        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (project.companyId !== companyId) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        const isMember = await this._projectMemberRepo.isMember(projectId, userId)

        if (!isMember) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.FORBIDDEN
            )
        }

        const task = await this._taskRepo.findById(taskId);
        if (!task) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (task.projectId !== projectId) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.TASK_NOT_BELONG_PROJECT,
                HttpStatus.FORBIDDEN
            )
        }

        const attachments = await this._attachmentRepo.findByTaskId(taskId);
        return attachments.map((a) => ({
            id: a.id,
            taskId: a.taskId,
            projectId: a.projectId,
            uploadedBy: a.uploadedBy,
            fileName: a.fileName,
            fileUrl: a.fileUrl,
            createdAt: a.createdAt,
        }))
    }
}