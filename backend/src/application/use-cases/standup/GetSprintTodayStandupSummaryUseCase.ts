
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { IStandupRepository } from "../../../domain/repositories/standup.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";

import { GetSprintTodayStandupSummaryResponseDTO, SprintTodayStandupMemberDTO } from "../../dto/standup/getSprintTodayStandupSummaryResponse.dto";
import { IGetSprintTodayStandupSummaryUseCase } from "../../interface/standup/IGetSprintTodayStandupSummaryUseCase";

export class GetSprintTodayStandupSummaryUseCase implements IGetSprintTodayStandupSummaryUseCase {
    constructor(
        private _standupRepo: IStandupRepository,
        private _sprintRepo: ISprintRepository,
        private _projectRepo: IProjectRepository,
        private _userRepo: IUserRepository,
        private _projectMemberRepo: IProjectMemberRepository
    ) { }

    async execute(userId: string, companyId: string, projectId: string): Promise<GetSprintTodayStandupSummaryResponseDTO> {
        const user = await this._userRepo.findById(userId)
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        if (user.role !== Role.COMPANY_ADMIN) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            );
        }

        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING,
                HttpStatus.FORBIDDEN
            );
        }


        if (!project.currentSprintId) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_ACTIVE,
                HttpStatus.BAD_REQUEST
            );
        }
        const sprint = await this._sprintRepo.findById(project.currentSprintId);
        if (!sprint) {
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }

        const members = await this._projectMemberRepo.findMembersByProject(projectId);

        const developerMembers = members.filter((m) => m.role === Role.DEVELOPER)

        const developerUserIds = developerMembers.map(m => m.userId)

        const users = await this._userRepo.findByIds(developerUserIds)

        const userMap = new Map(
            users.map((u) => [u.id, u])
        )

        const today = new Date();
        today.setHours(0, 0, 0, 0)

        const todayStandups = await this._standupRepo.findBySprintAndDate(sprint.id, today)

        const standupMap = new Map(
            todayStandups.map(s => [s.userId, s])
        )

        const memberSummaries: SprintTodayStandupMemberDTO[] = []

        let submittedCount = 0;
        let partialCount = 0;

        for (const member of developerMembers) {
            const standup = standupMap.get(member.userId);
            const userInfo = userMap.get(member.userId);

            if (standup) {

                const isPartial =
                    standup.blockers !== null &&
                    standup.blockers.trim() !== "";

                const status = isPartial ? "PARTIAL" : "SUBMITTED";

                if (!isPartial) {
                    submittedCount++;
                } else {
                    partialCount++
                }

                memberSummaries.push({
                    userId: member.userId,
                    name: userInfo?.name ?? "Unknown",
                    status,
                    mood: standup.mood,
                    standupId: standup.id
                });

            } else {

                memberSummaries.push({
                    userId: member.userId,
                    name: userInfo?.name ?? "Unknown",
                    status: "MISSED",
                    mood: null,
                    standupId: null
                });
            }

        }

        const totalMembers = developerMembers.length;
        const missedCount = totalMembers - (submittedCount + partialCount);


        const completionPercentage =
            totalMembers === 0
                ? 0
                : Math.round(((submittedCount + partialCount) / totalMembers) * 100);

        return {
            sprintId: sprint.id,
            sprintStatus: sprint.status,
            totalMembers,
            submittedCount,
            partialCount,
            missedCount,
            completionPercentage,
            members: memberSummaries
        }
    }
}