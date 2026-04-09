import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { getSocketInstance } from "../../../infrastructure/websocket/socket.instance";
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
        private _userRepo: IUserRepository,
        private _projectMemberRepository: IProjectMemberRepository,
        private _notificationRepository: INotificationRepository
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
        const sprintTask = await this._taskRepo.findBySprintId(sprintId);

        const leafTasks = sprintTask.filter(
            (task) => task.type === "TASK" || task.type === "BUG"
        );

        const incompleteTasks = leafTasks.filter(
            (task) => task.status !== "COMPLETED"
        );

        for (const task of incompleteTasks) {
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

        const members = await this._projectMemberRepository.findMembersByProject(projectId);

        const memberIds = members.map(m => m.userId);

        const users = await this._userRepo.findByIds(memberIds);

        const developers = users.filter(u => u.role === Role.DEVELOPER);

        for (const dev of developers) {
            const notification = await this._notificationRepository.create({
                userId: dev.id,
                type: "SPRINT_COMPLETED",
                title: "Sprint Completed",
                message: `Sprint "${sprint.name}" has been completed.`,
                metadata: {
                    sprintId: sprint.id,
                    projectId
                }
            });

            const io = getSocketInstance();

            io.to(`user:${dev.id}`).emit("new_notification", {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                metadata: notification.metadata,
                isRead: false,
                createdAt: notification.createdAt,
            });
        }
    }
}