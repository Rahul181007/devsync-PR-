import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { CreateTaskRequestDTO } from "../../dto/task/createTaskRequest.dto";
import { TaskResponseDTO } from "../../dto/task/taskResponse.dto";
import { ICreateTaskUseCase } from "../../interface/task/ICreateTaskUseCase";

export class CreateTaskUseCase implements ICreateTaskUseCase {
    constructor(
        private _taskRepo: ITaskRepository,
        private _userRepo: IUserRepository,
        private _projectRepo: IProjectRepository,
        private _projectMemberRepo: IProjectMemberRepository
    ) { }

    private _generateTaskCode(): string {
        return `Task-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }
    async execute(userId: string, companyId: string, projectId: string, data: CreateTaskRequestDTO): Promise<TaskResponseDTO> {
        const user = await this._userRepo.findById(userId);

        if (!user) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN
            )
        }

        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        if (project.status === "ARCHIVED") {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.ARCHIVED,
                HttpStatus.FORBIDDEN
            )
        }

        if (project.status === "COMPLETED") {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.COMPLETED,
                HttpStatus.FORBIDDEN
            )
        }

        if (project.endDate && data.dueDate && data.dueDate > project.endDate) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.DUE_DATE_OUTSIDE_PROJECT,
                HttpStatus.BAD_REQUEST
            )
        }

        if (data.dueDate && data.dueDate < new Date()) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.INVALID_DUE_DATE,
                HttpStatus.BAD_REQUEST
            )
        }
        let assigneeId: string | null = null;
        if (data.assigneeId) {
            const assignee = await this._userRepo.findById(data.assigneeId);
            if (!assignee) {
                throw new AppError(
                    RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                    HttpStatus.NOT_FOUND

                )
            }

            if (assignee.companyId !== companyId) {
                throw new AppError(
                    RESPONSE_MESSAGES.PROJECT.USER_NOT_IN_COMPANY,
                    HttpStatus.FORBIDDEN
                )
            }

            if (assignee.role !== Role.DEVELOPER) {
                throw new AppError(
                    RESPONSE_MESSAGES.TASK.INVALID_ASSIGNEE,
                    HttpStatus.BAD_REQUEST
                )
            }

            if (assignee.status !== 'ACTIVE') {
                throw new AppError(
                    RESPONSE_MESSAGES.AUTH.USER_NOT_ACTIVE,
                    HttpStatus.FORBIDDEN
                )
            }

            const isMember = await this._projectMemberRepo.isMember(projectId, assignee.id);
            if (!isMember) {
                throw new AppError(
                    RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                    HttpStatus.FORBIDDEN
                )
            }
            assigneeId = assignee.id
        }

        let parentId: string | null = null;

        if (data.parentId) {
            const parentTask = await this._taskRepo.findById(data.parentId);

            if (!parentTask || parentTask.projectId !== projectId) {
                throw new AppError(
                    RESPONSE_MESSAGES.TASK.NOT_FOUND,
                    HttpStatus.NOT_FOUND
                );
            }

            // Hierarchy validation
            if (data.type === "EPIC") {
                throw new AppError("Epic cannot have parent", HttpStatus.BAD_REQUEST);
            }

            if (data.type === "STORY" && parentTask.type !== "EPIC") {
                throw new AppError("Story must belong to Epic", HttpStatus.BAD_REQUEST);
            }

            if (data.type === "TASK" && parentTask.type !== "STORY") {
                throw new AppError("Task must belong to Story", HttpStatus.BAD_REQUEST);
            }

            if (data.type === "BUG" && parentTask.type !== "STORY") {
                throw new AppError("Bug must belong to Story", HttpStatus.BAD_REQUEST);
            }

            parentId = parentTask.id;
        }



        const createdTask = await this._taskRepo.create({
            companyId,
            projectId,
            sprintId: null,
            parentId: parentId,

            code: this._generateTaskCode(),
            title: data.title.trim(),
            description: data.description.trim(),

            type: data.type ?? "TASK",

            status: "BACKLOG",
            priority: data.priority,
            estimatedTime:data.estimatedTime??null,

            assigneeId,
            reporterId: user.id,

            dueDate: data.dueDate ?? null,
        });

        return {
            id: createdTask.id,
            companyId: createdTask.companyId,
            projectId: createdTask.projectId,
            sprintId: createdTask.sprintId,
            parentId: createdTask.parentId,

            code: createdTask.code,
            title: createdTask.title,
            description: createdTask.description,

            type: createdTask.type,
            status: createdTask.status,
            priority: createdTask.priority,
            estimatedTime:createdTask.estimatedTime,

            assigneeId: createdTask.assigneeId,
            reporterId: createdTask.reporterId,

            dueDate: createdTask.dueDate,

            createdAt: createdTask.createdAt,
            updatedAt: createdTask.updatedAt,
        };
    }
}



