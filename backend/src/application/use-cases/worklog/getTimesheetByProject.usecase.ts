import { IMeetingRepository } from "../../../domain/repositories/meeting.repository";
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWorklogRepository } from "../../../domain/repositories/worklog.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetTimesheetByProjectRequestDTO } from "../../dto/worklog/getTimesheetByProjectRequest.dto";
import { TimesheetProjectItemDTO } from "../../dto/worklog/getTimesheetByProjectResponse.dto";
import { IGetTimesheetByProjectUseCase } from "../../interface/worklog/IGetTimesheetByProjectUseCase";

export class GetTimesheetByProjectUseCase implements IGetTimesheetByProjectUseCase {
    constructor(
        private _worklogRepo: IWorklogRepository,
        private _projectMemberRepo: IProjectMemberRepository,
        private _projectRepo: IProjectRepository,
        private _userRepo: IUserRepository,
        private _meetingRepo: IMeetingRepository,
    ) { }

    async execute(userId: string, companyId: string, projectId: string, query: GetTimesheetByProjectRequestDTO): Promise<TimesheetProjectItemDTO[]> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        }

        const project = await this._projectRepo.findById(projectId);
        if (!project) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        }
        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN,
            );
        }

        const isMember = await this._projectMemberRepo.isMember(projectId, userId);
        if (!isMember) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.FORBIDDEN,
            );
        }


        const worklogs = await this._worklogRepo.findByProjectIdWithUser(projectId);
        const meetings = await this._meetingRepo.findCompletedMeetings(projectId);


        let filtered = worklogs;

        if (query.startDate) {
            filtered = filtered.filter((log) => log.date >= query.startDate!);
        }

        if (query.endDate) {
            filtered = filtered.filter((log) => log.date <= query.endDate!);
        }

        if (query.userId) {
            filtered = filtered.filter((log) => log.userId === query.userId);
        }

        const grouped: Record<
            string,
            {
                totalHours: number;
                userName: string;
                tasks: { taskTitle: string; timeSpent: number }[];
                meetings: { title: string; duration: number }[];
            }
        > = {};

        filtered.forEach((log) => {
            console.log("log.date:", log.date);
            const d = new Date(log.date);

            const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

            const key = `${date}_${log.userId}`;

            if (!grouped[key]) {
                grouped[key] = {
                    totalHours: 0,
                    userName: log.userName,
                    tasks: [],
                    meetings: [],
                };
            }

            grouped[key].totalHours += log.timeSpent / 60;

            grouped[key].tasks.push({
                taskTitle: log.taskTitle,
                timeSpent: log.timeSpent,
            });
        });

        if (meetings.length > 0) {
            const members = await this._projectMemberRepo.findMembersByProject(projectId);
            const memberIds = members.map(m => m.userId);
            const users = await this._userRepo.findByIds(memberIds);
            const developers = users.filter(u => u.role === Role.DEVELOPER);

            meetings.forEach((meeting) => {
                const d = new Date(meeting.scheduledAt);
                const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

                developers.forEach((dev) => {
                    const key = `${date}_${dev.id}`;

                    if (!grouped[key]) {
                        grouped[key] = {
                            totalHours: 0,
                            userName: dev.name,
                            tasks: [],
                            meetings: [],
                        };
                    }

                    const hours = (meeting.durationMinutes ?? 0) / 60;

                    grouped[key].totalHours += hours;

                    grouped[key].meetings.push({
                        title: meeting.title,
                        duration: meeting.durationMinutes ?? 0,
                    });
                });
            });
        }


     const SHIFT_HOURS=8;

        return Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => {
                const [date] = key.split("_");
                const total=Math.round(value.totalHours * 100) / 100;
                const unlogged= Math.max(0, SHIFT_HOURS - total);

                return {
                    date,
                    totalHours: Math.round(value.totalHours * 100) / 100,
                    userName: value.userName,
                    tasks: value.tasks,
                    meetings: value.meetings,
                    unloggedHours:unlogged
                };
            });
    }
}