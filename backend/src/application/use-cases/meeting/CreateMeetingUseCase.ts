
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
import { CreateMeetingDTO } from "../../dto/meeting/createMeeting.dto";
import { MeetingResponseDTO } from "../../dto/meeting/meetingResponse.dto";
import { ICreateMeetingUseCase } from "../../interface/meeting/ICreateMeetingUseCase";

export class CreateMeetingUseCase implements ICreateMeetingUseCase {
    constructor(
        private _meetingRepo: IMeetingRepository,
        private _userRepo: IUserRepository,
        private _projectRepo: IProjectRepository,
        private _sprintRepo: ISprintRepository,
        private _projectMemberRepository: IProjectMemberRepository,
        private _notificationRepository: INotificationRepository,
    ) { }

    async execute(userId: string, companyId: string, data: CreateMeetingDTO): Promise<MeetingResponseDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        const project = await this._projectRepo.findById(data.projectId);
        if (!project) {
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }
        if (data.sprintId) {
            const sprint = await this._sprintRepo.findById(data.sprintId);
            if (!sprint) {
                throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND, HttpStatus.NOT_FOUND)
            }
            if (sprint.projectId !== project.id) {
                throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_BELONG_PROJECT, HttpStatus.BAD_REQUEST)
            }
        }


        const meeting = await this._meetingRepo.create({
            projectId: project.id,
            createdBy: userId,
            sprintId: data.sprintId ?? null,

            title: data.title.trim(),
            description: data.description?.trim() ?? null,

            scheduledAt: data.scheduledAt,
            durationMinutes: data.durationMinutes ?? null,

            meetingLink: data.meetingLink ?? null,
            meetingType: data.meetingType ?? null,
            type: data.type ?? "GENERAL",
        });

        // 🔹 get project members
        const members = await this._projectMemberRepository.findMembersByProject(project.id);

        const memberIds = members.map(m => m.userId);

        const users = await this._userRepo.findByIds(memberIds);

        const developers = users.filter(u => u.role === Role.DEVELOPER);

        // 🔹 send notification
        for (const dev of developers) {
            const notification = await this._notificationRepository.create({
                userId: dev.id,
                type: "MEETING_CREATED",
                title: "New Meeting Scheduled",
                message: `Meeting "${meeting.title}" has been scheduled.`,
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

        return {
            id: meeting.id,
            projectId: meeting.projectId,
            sprintId: meeting.sprintId,

            title: meeting.title,
            description: meeting.description,

            scheduledAt: meeting.scheduledAt,
            durationMinutes: meeting.durationMinutes,

            meetingLink: meeting.meetingLink,
            meetingType: meeting.meetingType,
            type:meeting.type,

            notes: meeting.notes,
            decisions: meeting.decisions,

            status: meeting.status,

            createdBy: meeting.createdBy,
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt,
        };

    }
}