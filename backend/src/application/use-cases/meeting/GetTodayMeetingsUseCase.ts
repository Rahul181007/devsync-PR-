import { IMeetingRepository } from "../../../domain/repositories/meeting.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetTodayMeetingsDTO } from "../../dto/meeting/getTodayMeetings.dto";
import { GetTodayMeetingsResponseDTO } from "../../dto/meeting/getTodayMeetingsResponse.dto";
import { IGetTodayMeetingsUseCase } from "../../interface/meeting/IGetTodayMeetingsUseCase";

export class GetTodayMeetingsUseCase implements IGetTodayMeetingsUseCase {
    constructor(
        private _meetingRepo: IMeetingRepository,
        private _userRepo: IUserRepository,
        private _projectRepo: IProjectRepository,
        private _projectMemberRepo: IProjectMemberRepository
    ) { }

    async execute(userId: string, companyId: string, data: GetTodayMeetingsDTO): Promise<GetTodayMeetingsResponseDTO> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const project = await this._projectRepo.findById(data.projectId);
        if (!project) {
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (project.companyId !== companyId) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
        }
        if (user.role === Role.DEVELOPER) {
            const isMember = await this._projectMemberRepo.isMember(data.projectId, user.id)
            if (!isMember) {
                throw new AppError(RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND, HttpStatus.FORBIDDEN)
            }
        }

        const items = await this._meetingRepo.findTodayMeetings(data.projectId);

        return {
            items: items.map(meeting => ({
                id: meeting.id,
                projectId: meeting.projectId,
                sprintId: meeting.sprintId,

                title: meeting.title,
                description: meeting.description,

                scheduledAt: meeting.scheduledAt,
                durationMinutes: meeting.durationMinutes,

                meetingLink: meeting.meetingLink ,
                meetingType: meeting.meetingType ,
                type: meeting.type,

                notes: meeting.notes,
                decisions: meeting.decisions,

                status: meeting.status,

                createdBy: meeting.createdBy,
                createdAt: meeting.createdAt,
                updatedAt: meeting.updatedAt,
            }))
        };
    }
}