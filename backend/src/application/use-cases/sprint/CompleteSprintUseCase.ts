import { IMeetingRepository } from "../../../domain/repositories/meeting.repository";
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


function setTime(date: Date, hours: number, minutes: number = 0): Date {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}
export class CompleteSprintUseCase implements ICompleteSprintUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _projectRepo: IProjectRepository,
        private _taskRepo: ITaskRepository,
        private _userRepo: IUserRepository,
        private _projectMemberRepository: IProjectMemberRepository,
        private _notificationRepository: INotificationRepository,
        private _meetingRepo: IMeetingRepository
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

        const existingMeetings = await this._meetingRepo.findAll({
            projectId: sprint.projectId,
            page: 1,
            limit: 10,
            sprintId: sprint.id
        });

        const hasReviewMeeting = existingMeetings.items.some(
            (m) => m.title === `${sprint.name} - Sprint Review`
        );

        if (!hasReviewMeeting) {
            const meeting = await this._meetingRepo.create({
                projectId: sprint.projectId,
                createdBy: userId,
                sprintId: sprint.id,

                title: `${sprint.name} - Sprint Review`,
                description: "Sprint review meeting",

                scheduledAt: setTime(sprint.endDate, 17),
                durationMinutes: 60,

                meetingLink: null,
                meetingType: null,
                type:"SPRINT_REVIEW"
            });

            

            // 🔹 get project members
            const members = await this._projectMemberRepository.findMembersByProject(projectId);

            const memberIds = members.map(m => m.userId);

            const users = await this._userRepo.findByIds(memberIds);

            const developers = users.filter(u => u.role === Role.DEVELOPER);

            // 🔹 send notification
            for (const dev of developers) {
                const notification = await this._notificationRepository.create({
                    userId: dev.id,
                    type: "SPRINT_REVIEW_SCHEDULED",
                    title: "Sprint Completed",
                    message: `Sprint "${sprint.name}" completed. Review meeting scheduled.`,
                    metadata: {
                        meetingId: meeting.id,
                        projectId: meeting.projectId
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