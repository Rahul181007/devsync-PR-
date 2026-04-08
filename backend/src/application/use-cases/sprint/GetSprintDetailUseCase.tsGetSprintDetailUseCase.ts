import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetSprintDetailResponseDTO } from "../../dto/sprint/getSprintDetailResponse.dto";
import { IGetSprintDetailUseCase } from "../../interface/sprint/IGetSprintDetailUseCase";

export class GetSprintDetailUseCase implements IGetSprintDetailUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _projectRepo: IProjectRepository,
        private _taskRepo: ITaskRepository,
        private _userRepo: IUserRepository
    ) { }

    async execute(userId: string, companyId: string, projectId: string, sprintId: string): Promise<GetSprintDetailResponseDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        const project = await this._projectRepo.findById(projectId);
        console.log(project)
        if (!project) {
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        const sprint = await this._sprintRepo.findById(sprintId);
        if (!sprint) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }
        if (sprint.projectId !== projectId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const storyIds = sprint.stories;
        const stories = (await this._taskRepo.findByIds(storyIds)).filter(task => task.type === "STORY");
        const totalStoryPoints = stories.reduce((sum, story) => sum + (story.storyPoints || 0), 0)


        const allProjectTasks = await this._taskRepo.findByProjectId(projectId);
        const sprintTask = allProjectTasks.filter((task) => task.sprintId === sprintId)

        const taskByStory = new Map<string, typeof sprintTask>();

        for (const task of sprintTask) {
            if ((task.type === "TASK" || task.type === "BUG") && task.parentId) {
                if (!taskByStory.has(task.parentId)) {
                    taskByStory.set(task.parentId, [])
                }
                taskByStory.get(task.parentId)?.push(task);
            }

        }

        let completedStoryPoints = 0;

        for (const story of stories) {
            const storyTasks = taskByStory.get(story.id) || []

            const isCompleted = storyTasks.length > 0 && storyTasks.every((task) => task.status === "COMPLETED");

            if (isCompleted) {
                completedStoryPoints += story.storyPoints || 0
            }
        }

        const progressPercentage = totalStoryPoints === 0 ? 0 : Math.round((completedStoryPoints / totalStoryPoints) * 100);

        const tasksWithAssignee = await Promise.all(
    sprintTask.map(async (task) => {
        let assignee = null;

        if (task.assigneeId) {
            const user = await this._userRepo.findById(task.assigneeId);

            if (user) {
                assignee = {
                    id: user.id,
                    name: user.name,
                };
            }
        }

        return {
            id: task.id,
            code: task.code,
            title: task.title,
            type: task.type,
            status: task.status,
            priority: task.priority,
            parentId: task.parentId,
            sprintId: task.sprintId,
            storyPoints: task.storyPoints ?? 0,
            assignee,
        };
    })
);
        return {
            sprint: {
                id: sprint.id,
                projectId: sprint.projectId,
                name: sprint.name,
                goal: sprint.goal,
                startDate: sprint.startDate,
                endDate: sprint.endDate,
                status: sprint.status,
                createdBy: sprint.createdBy,
                createdAt: sprint.createdAt,
                updatedAt: sprint.updatedAt
            },
            tasks:tasksWithAssignee,
            totalStoryPoints,
            completedStoryPoints,
            progressPercentage
        }
    }
}