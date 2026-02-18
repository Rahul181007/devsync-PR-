import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { ICompleteSprintUseCase } from "../../interface/sprint/ICompleteSprintUseCase";

export class CompleteSprintUseCase implements ICompleteSprintUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _projectRepo: IProjectRepository,
        private _taskRepo: ITaskRepository,
        private _userRepo: IUserRepository
    ) { }

    async execute(userId: string, companyid: string, projectId: string, sprintId: string): Promise<void> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);

        }
        if (project.companyId !== companyid) {
            throw new AppError(RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING, HttpStatus.FORBIDDEN)
        }

        if (project.status !== "ACTIVE") {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_ACTIVE,
                HttpStatus.BAD_REQUEST
            );
        }


        const sprint = await this._sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if (sprint.projectId !== projectId) {
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_BELONG_PROJECT, HttpStatus.FORBIDDEN)
        }

        if (sprint.status !== "ACTIVE") {
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_ACTIVE, HttpStatus.BAD_REQUEST)
        }

        const allTasks = await this._taskRepo.findByProjectId(projectId);
        const sprintTask = allTasks.filter((task) => task.sprintId === sprintId);

        for (const task of sprintTask) {
            if (task.status !== "COMPLETED") {
                task.sprintId = null;
                task.status = "BACKLOG";
                task.assigneeId = null;

                await this._taskRepo.update(task)
            }
        }
        sprint.status = "COMPLETED";
        await this._sprintRepo.update(sprint);

        await this._projectRepo.update(projectId, {
            currentSprintId: null
        })
    }
}