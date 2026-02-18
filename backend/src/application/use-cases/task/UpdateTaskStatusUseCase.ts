import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateTaskStatusDTO } from "../../dto/task/UpdateTaskStatus.dto";
import { IUpdateTaskStatusUseCase } from "../../interface/task/IUpdateTaskStatusUseCase";

export class UpdateTaskStatusUseCase implements IUpdateTaskStatusUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _taskRepo: ITaskRepository,
        private _projectRepo: IProjectRepository
    ) { }

    async execute(userId: string, companyId: string, projectId: string, taskId: string, data: UpdateTaskStatusDTO): Promise<void> {
        const user = await this._userRepo.findById(userId);

        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        const project = await this._projectRepo.findById(projectId);
        if (!project || project.companyId !== companyId) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        if (project.status !== "ACTIVE") {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_ACTIVE,
                HttpStatus.BAD_REQUEST
            );
        }


        const task = await this._taskRepo.findById(taskId);

        if (!task || task.projectId !== projectId) {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (task.status !== "SUBMITTED") {
            throw new AppError(
                RESPONSE_MESSAGES.TASK.INVALID_STATUS_TRANSITION,
                HttpStatus.BAD_REQUEST
            )
        }
        if (data.status !== "COMPLETED" && data.status !== "IN_PROGRESS") {
            throw new AppError(RESPONSE_MESSAGES.TASK.INVALID_STATUS_TRANSITION, HttpStatus.BAD_REQUEST)
        }

        task.status = data.status;
        await this._taskRepo.update(task)

    }
}