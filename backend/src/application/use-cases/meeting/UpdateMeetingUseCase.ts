import { IMeetingRepository } from "../../../domain/repositories/meeting.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { MeetingResponseDTO } from "../../dto/meeting/meetingResponse.dto";
import { UpdateMeetingDTO } from "../../dto/meeting/updateMeeting.dto";
import { IUpdateMeetingUsecase } from "../../interface/meeting/IUpdateMeetingUseCase";

export class UpdateMeetingUseCase implements IUpdateMeetingUsecase {
    constructor(
        private _meetingRepo: IMeetingRepository,
        private _userRepo: IUserRepository,
        private _projectRepo: IProjectRepository
    ) { }

    async execute(userId: string, companyId: string, data: UpdateMeetingDTO): Promise<MeetingResponseDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const meeting = await this._meetingRepo.findById(data.meetingId);

        if (!meeting) {
            throw new AppError(
                RESPONSE_MESSAGES.MEETINGS.NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        const project = await this._projectRepo.findById(meeting.projectId);
        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            );
        }

        if (data.notes !== undefined) {
            meeting.notes = data.notes
        }

        if (data.decisions !== undefined) {
            meeting.decisions = data.decisions
        }

        if (data.status) {
            meeting.status = data.status
        }
        if (data.meetingLink !== undefined) {
            meeting.meetingLink = data.meetingLink;
        }

        await this._meetingRepo.save(meeting)

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
            type: meeting.type,

            notes: meeting.notes,
            decisions: meeting.decisions,

            status: meeting.status,

            createdBy: meeting.createdBy,
            createdAt: meeting.createdAt,
            updatedAt: meeting.updatedAt,
        }
    }
}