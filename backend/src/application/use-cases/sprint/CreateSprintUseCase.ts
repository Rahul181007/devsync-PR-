import { IMeetingRepository } from "../../../domain/repositories/meeting.repository";
import { INotificationRepository } from "../../../domain/repositories/notification.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { getSocketInstance } from "../../../infrastructure/websocket/socket.instance";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { CreateSprintRequestDTO } from "../../dto/sprint/createSprintRequest.dto";
import { SprintResponseDTO } from "../../dto/sprint/sprintResponse.dto";
import { ICreateSprintUseCase } from "../../interface/sprint/ICreateSprintUseCase";


function setTime(date: Date, hours: number, minutes: number = 0): Date {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}
export class CreateSprintUseCase implements ICreateSprintUseCase {
    constructor(
        private _sprintRepo: ISprintRepository,
        private _projectRepo: IProjectRepository,
        private _userRepo: IUserRepository,
        private _meetingRepo: IMeetingRepository,

        private _projectMemberRepository: IProjectMemberRepository,
        private _notificationRepository: INotificationRepository
    ) { }


    async execute(userId: string, companyId: string, projectId: string, data: CreateSprintRequestDTO): Promise<SprintResponseDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }
        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }
        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }


        if (project.companyId !== companyId) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }

        if (project.status === "ARCHIVED" || project.status === "COMPLETED") {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.ARCHIVED,
                HttpStatus.FORBIDDEN
            )
        }


        if (data.startDate > data.endDate) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.INVALID_DATE_RANGE,
                HttpStatus.BAD_REQUEST
            )
        }

        if (project.startDate && data.startDate < project.startDate) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.INVALID_SPRINT_START_DATE,
                HttpStatus.BAD_REQUEST
            )
        }

        if (project.endDate && data.endDate > project.endDate) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.INVALID_SPRINT_END_DATE,
                HttpStatus.BAD_REQUEST
            )
        }
        const existingSprints = await this._sprintRepo.findByProjectId(projectId);
        const duplicate = existingSprints.find((s) => s.name.toLowerCase() === data.name.toLowerCase())

        if (duplicate) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NAME_EXISTS,
                HttpStatus.CONFLICT
            )
        }
        const overlapping = existingSprints.find(
            (s) =>
                s.status !== "COMPLETED" &&
                s.startDate <= data.endDate &&
                s.endDate >= data.startDate
        )

        if (overlapping) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_DATE_OVERLAP, HttpStatus.CONFLICT
            )
        }





        const sprint = await this._sprintRepo.create({
            projectId,
            companyId,
            name: data.name,
            goal: data.goal ?? null,
            startDate: data.startDate,
            endDate: data.endDate,
            status: "PLANNED",
            createdBy: userId
        })

        const meeting = await this._meetingRepo.create({
            projectId: sprint.projectId,
            createdBy: userId,
            sprintId: sprint.id,

            title: `${sprint.name} - Sprint Planning`,
            description: "Sprint planning meeting",

            scheduledAt: setTime(sprint.startDate, 10),
            durationMinutes: 60,

            meetingLink: null,
            meetingType: null,
        });

        const members = await this._projectMemberRepository.findMembersByProject(projectId);

        const memberIds = members.map(m => m.userId);
        const users = await this._userRepo.findByIds(memberIds);

        const developers = users.filter(u => u.role === Role.DEVELOPER);

        for (const dev of developers) {
            const notification = await this._notificationRepository.create({
                userId: dev.id,
                type: "MEETING_CREATED",
                title: "Sprint Planning Meeting Scheduled",
                message: `Meeting "${meeting.title}" has been scheduled.`,
                metadata: {
                    meetingId: meeting.id,
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

        return {
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
        }
    }
}