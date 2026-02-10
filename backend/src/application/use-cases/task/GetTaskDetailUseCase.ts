import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { TaskDetailResponsDTO } from "../../dto/task/TaskDetailResponse.dto";
import { IGetTaskDetailUseCase } from "../../interface/task/IGetTaskDetailUseCase";

export class GetTaskDetailUseCase implements IGetTaskDetailUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _projectRepo: IProjectRepository,
        private _taskRepo: ITaskRepository
    ) { }
    async execute(userId: string, companyId: string, projectId: string, taskId: string): Promise<TaskDetailResponsDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        const project = await this._projectRepo.findById(projectId);

        if (!project) {
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const task = await this._taskRepo.findById(taskId);
        if (!task || task.projectId !== projectId) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        let assignee = null

        if (task.assigneeId) {
            const assigneeUser = await this._userRepo.findById(task.assigneeId);

            if (assigneeUser) {
                assignee = {
                    id: assigneeUser.id,
                    name: assigneeUser.name,
                    avatar: assigneeUser.avatarUrl ?? null
                }
            }

            const reportUser = await this._userRepo.findById(task.reporterId);
            if (!reportUser) {
                throw new AppError(
                    RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                    HttpStatus.NOT_FOUND
                )
            }
            return {
                id: task.id,
                code: task.code,

                title: task.title,
                description: task.description,

                status: task.status,
                priority: task.priority,

                sprint: task.sprintId ? { id: task.sprintId, name: "Active sprint" } : null,

                assignee,

                reporter: {
                    id: reportUser.id,
                    name: reportUser.name
                },
                dueDate: task.dueDate,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt
            }

        }
        throw new AppError(
            RESPONSE_MESSAGES.TASK.NOT_FOUND,
            HttpStatus.NOT_FOUND
        );
    }
}