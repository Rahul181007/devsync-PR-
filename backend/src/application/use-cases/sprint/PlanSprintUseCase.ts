import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { PlanSprintResponseDTO } from "../../dto/sprint/planSprintResponse.dto";
import { PlanSprintRequestDTO } from "../../dto/task/planSprint.dto";
import { IPlanSprintUseCase } from "../../interface/sprint/IPlanSprintUseCase";

export class PlanSprintUseCase implements IPlanSprintUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _userRepo: IUserRepository,
        private _taskRepo: ITaskRepository
    ) { }

    async execute(userId: string, companyId: string, projectId: string, data: PlanSprintRequestDTO): Promise<PlanSprintResponseDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const sprint = await this._sprintRepo.findById(data.sprintId);
        if (!sprint) {
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if (sprint.companyId !== companyId) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
        }
        if (sprint.projectId !== projectId) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_BELONG_PROJECT,
                HttpStatus.FORBIDDEN
            );
        }
        if (sprint.status !== "PLANNED") {
            throw new AppError("Sprint already started or completed", HttpStatus.BAD_REQUEST)
        }

        const tasks = await this._taskRepo.findByIds(data.storyIds);

        if (tasks.length !== data.storyIds.length) {
            throw new AppError("Some stories are not found", HttpStatus.NOT_FOUND)
        }

        const totalPoints = tasks.reduce(
            (sum, story) => sum + (story.storyPoints || 0),
            0
        );

        if (totalPoints > 20) {
            throw new AppError(
                "Sprint capacity exceeded",
                HttpStatus.BAD_REQUEST
            );
        }
        for (const task of tasks) {
            if (task.type !== "STORY") {
                throw new AppError("Only story can be added", HttpStatus.BAD_REQUEST)
            }
            if (task.projectId !== sprint.projectId) {
                throw new AppError("Story not in this project", HttpStatus.BAD_REQUEST)
            }
        }

        const uniqueStoryIds = [...new Set(data.storyIds)]

        // 1. Update sprint
        sprint.stories = uniqueStoryIds;
        await this._sprintRepo.update(sprint);

        // 2. Update stories
        await Promise.all(
            tasks.map((story) => {
                story.sprintId = sprint.id;
                return this._taskRepo.update(story);
            })
        );

        // 3. Update child tasks
        const allTasks = await this._taskRepo.findByProjectId(projectId);

        const tasksToAssign = allTasks.filter(
            (task) =>
                (task.type === "TASK" || task.type === "BUG") &&
                task.parentId &&
                uniqueStoryIds.includes(task.parentId)
        );

        await Promise.all(
            tasksToAssign.map((task) => {
                task.sprintId = sprint.id;
                return this._taskRepo.update(task);
            })
        );
        const updatedSprint = await this._sprintRepo.update(sprint);


        return {
            id: updatedSprint.id,
            stories: updatedSprint.stories
        }
    }
}