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


      private async updateStoryStatus(storyId: string) {
            const tasks = await this._taskRepo.findByParentId(storyId);
    
            if (tasks.length === 0) return;
    
const isDone = (status: string) =>
  status === "COMPLETED";
    
            const allCompleted = tasks.every(t => isDone(t.status));
    
            const anyInProgress = tasks.some(t => t.status === "IN_PROGRESS");
    
    
            let status: "TODO" | "IN_PROGRESS" | "COMPLETED" = "TODO";
    
            if (allCompleted) {
                status = "COMPLETED";
            } else if (anyInProgress) {
                status = "IN_PROGRESS";
            }
    
            await this._taskRepo.updateStatus(storyId, status);
    
    
            const story = await this._taskRepo.findById(storyId);
    
            if (story?.parentId) {
                await this.updateEpicStatus(story.parentId.toString());
            }
        }
    
        private async updateEpicStatus(epicId: string) {
            const stories = await this._taskRepo.findByParentId(epicId);
    
            if (stories.length === 0) return;
const isDone = (status: string) =>
  status === "COMPLETED";
    
            const allCompleted = stories.every(s => isDone(s.status));
            const anyInProgress = stories.some(s => s.status === "IN_PROGRESS");
    
            let status: "TODO" | "IN_PROGRESS" | "COMPLETED" = "TODO";
    
            if (allCompleted) {
                status = "COMPLETED";
            } else if (anyInProgress) {
                status = "IN_PROGRESS";
            }
    
            await this._taskRepo.updateStatus(epicId, status);
        }
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

        if (task.parentId) {
    await this.updateStoryStatus(task.parentId.toString());
}

    }
}