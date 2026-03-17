import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { TaskResponseDTO } from "../../dto/task/taskResponse.dto";
import { UpdateTaskRequestDTO } from "../../dto/task/updateTaskRequest.dto";
import { IupdateTaskUseCase } from "../../interface/task/IUpdateTask.usecase";

export class UpdateTaskUseCase implements IupdateTaskUseCase {
    constructor(
        private _taskRepo: ITaskRepository,
        private _userRepo: IUserRepository,
        private _projectRepo: IProjectRepository,
        private _projectMemberRepo: IProjectMemberRepository
    ) { }

    async execute(userId: string, companyId: string, projectId: string, taskId: string, data: UpdateTaskRequestDTO): Promise<TaskResponseDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        const project = await this._projectRepo.findById(projectId);

        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            );
        }

        const task = await this._taskRepo.findById(taskId);

        if (!task) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        if (data.dueDate && project.endDate && data.dueDate > project.endDate) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.DUE_DATE_OUTSIDE_PROJECT,
                HttpStatus.BAD_REQUEST
            );
        }

        if (data.dueDate && data.dueDate < new Date()) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.INVALID_DUE_DATE,
                HttpStatus.BAD_REQUEST
            );
        }

        let assigneeId: string | null = task.assigneeId;

        if (data.assigneeId) {
            const assignee = await this._userRepo.findById(data.assigneeId);

            if (!assignee) {
                throw new AppError(
                    RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                    HttpStatus.NOT_FOUND
                );
            }

            if (assignee.companyId !== companyId) {
                throw new AppError(
                    RESPONSE_MESSAGES.PROJECT.USER_NOT_IN_COMPANY,
                    HttpStatus.FORBIDDEN
                );
            }

            if (assignee.role !== Role.DEVELOPER) {
                throw new AppError(
                    RESPONSE_MESSAGES.TASK.INVALID_ASSIGNEE,
                    HttpStatus.BAD_REQUEST
                );
            }

            const isMember = await this._projectMemberRepo.isMember(
                projectId,
                assignee.id
            );

            if (!isMember) {
                throw new AppError(
                    RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                    HttpStatus.FORBIDDEN
                );
            }

            assigneeId = assignee.id;
        }

        // Prevent type change if task has children
        if (data.type && data.type !== task.type) {
            const children = await this._taskRepo.findByParentId(taskId);

            if (children.length > 0) {
                throw new AppError(
                    RESPONSE_MESSAGES.TASK.CANNOT_CHANGE_TYPE_WITH_CHILDREN,
                    HttpStatus.BAD_REQUEST
                );
            }
        }


        if (data.title) task.title = data.title.trim();
        if (data.description) task.description = data.description.trim();
        if (data.type) task.type = data.type;
        if (data.priority) task.priority = data.priority;
        if (data.dueDate !== undefined) task.dueDate = data.dueDate ?? null;

        task.assigneeId = assigneeId;


        const updatedTask = await this._taskRepo.update(task);

        return {
            id: updatedTask.id,
            companyId: updatedTask.companyId,
            projectId: updatedTask.projectId,
            sprintId: updatedTask.sprintId,
            parentId: updatedTask.parentId,


            code: updatedTask.code,
            title: updatedTask.title,
            description: updatedTask.description,

            type: updatedTask.type,
            status: updatedTask.status,
            priority: updatedTask.priority,

            assigneeId: updatedTask.assigneeId,
            reporterId: updatedTask.reporterId,

            dueDate: updatedTask.dueDate,

            createdAt: updatedTask.createdAt,
            updatedAt: updatedTask.updatedAt,
        };

    }
}