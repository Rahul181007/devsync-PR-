import { IActivityRepository } from "../../../../domain/repositories/activity.repository";
import { IProjectMemberRepository } from "../../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IWorklogRepository } from "../../../../domain/repositories/worklog.repository";
import { HttpStatus } from "../../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { AppError } from "../../../../shared/errors/AppError";
import { DeveloperDashboardResponseDto } from "../../../dto/dashboard/developer/dashboard.dto";
import { IGetDeveloperDashboardUseCase } from "../../../interface/dashboard/developer/getDeveloperDashboard.usecase";

export class GetDeveloperDashboardUseCase implements IGetDeveloperDashboardUseCase {

    constructor(
        private _taskRepository: ITaskRepository,
        private _userRepo: IUserRepository,
        private _projectMemberRepo: IProjectMemberRepository,
        private _activityRepo: IActivityRepository,
        private _worklogRepo: IWorklogRepository
    ) { }

    async execute(userId: string): Promise<DeveloperDashboardResponseDto> {
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        const taskStats = await this._taskRepository.countTasksByStatusForUser(userId);
        let assigned = 0;
        let pending = 0;
        let inProgress = 0;
        let completed = 0;

        for (const item of taskStats) {
            assigned += item.count;
            switch (item._id) {
                case "BACKLOG":
                case "TODO":
                    pending += item.count;
                    break;

                case "IN_PROGRESS":
                case "SUBMITTED":
                    inProgress += item.count;
                    break;

                case "COMPLETED":
                    completed += item.count;
                    break;
            }
        }
        const tasks = await this._taskRepository.getPriorityTasks(userId);

        const projects = await this._projectMemberRepo.countByUser(userId);
        const recentActivity = await this._activityRepo.getRecentActivitiesByUser(userId);
        const worklogChart = await this._worklogRepo.getWorklogTrendByUser(userId);
        return {
            stats: {
                assigned,
                pending,
                inProgress,
                completed,
                projects
            },
            tasks,
            recentActivity,
            worklogChart
        }

    }


}