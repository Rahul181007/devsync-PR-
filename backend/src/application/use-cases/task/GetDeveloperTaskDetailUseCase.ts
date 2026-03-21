import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { DeveloperTaskDetailDTO } from "../../dto/task/DeveloperTaskDetail.dto";
import { IGetDeveloperTaskDetailUseCase } from "../../interface/task/IGetDeveloperTaskDetailUseCase";

export class GetDeveloperTaskDetailUseCase implements IGetDeveloperTaskDetailUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _projectRepo: IProjectRepository,
        private _taskRepo: ITaskRepository,
        private _projectMemberRepo: IProjectMemberRepository
    ) { }

    async execute(userId: string, projectId: string, taskId: string): Promise<DeveloperTaskDetailDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user || user.role !== Role.DEVELOPER) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        const project = await this._projectRepo.findById(projectId);
        if (!project || project.companyId != user.companyId) {
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (!project.currentSprintId) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        const isMember = await this._projectMemberRepo.isMember(projectId, userId);
        if (!isMember) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        const task = await this._taskRepo.findById(taskId);
        if (!task || task.projectId !== projectId || task.sprintId !== project.currentSprintId || task.assigneeId !== userId) {
            throw new AppError(RESPONSE_MESSAGES.TASK.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            id: task.id,
            title: task.title,
            description: task.description,
            type: task.type,       
            parentId: task.parentId,
            status: task.status,
            priority: task.priority,
            estimatedTime:task.estimatedTime??null,
            dueDate: task.dueDate
        }
    }
}