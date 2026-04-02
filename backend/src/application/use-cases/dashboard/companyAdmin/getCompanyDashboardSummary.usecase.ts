import { IActivityRepository } from "../../../../domain/repositories/activity.repository";
import { ICompanyRepository } from "../../../../domain/repositories/company.repository";
import { IProjectRepository } from "../../../../domain/repositories/project.repository";
import { ITaskRepository } from "../../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { IWorklogRepository } from "../../../../domain/repositories/worklog.repository";
import { HttpStatus } from "../../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
import { AppError } from "../../../../shared/errors/AppError";
import { DashboardSummaryDTO } from "../../../dto/dashboard/companyAdmin/dashboardSummary.dto";
import { IGetCompanyDashboardSummaryUseCase } from "../../../interface/dashboard/companyAdmin/IGetCompanyDashboardSummaryUseCase";

export class GetCompanyDashboardSummaryUseCase implements IGetCompanyDashboardSummaryUseCase {
    constructor(
        private _projectRepo: IProjectRepository,
        private _userRepo: IUserRepository,
        private _taskRepo: ITaskRepository,
        private _companyRepo: ICompanyRepository,
        private _worklogRepo:IWorklogRepository,
        private _activityRepo:IActivityRepository
    ) { }

    async execute(companyId: string): Promise<DashboardSummaryDTO> {
        const company = await this._companyRepo.findById(companyId);
        if (!company) {
            throw new AppError(RESPONSE_MESSAGES.COMPANY.NOT_FOUND, HttpStatus.NOT_FOUND)
        }


        const [
            totalProjects,
            activeProjects,

            totalDevelopers,
            blockedDevelopers,
            activeDevelopers,

            totalTasks,
            completedTasks,
            overdueTasks,

            worklogTrend,
            projectHealth,
            activityFeed
        ] = await Promise.all([
            this._projectRepo.countByCompany(companyId),
            this._projectRepo.countByCompanyAndStatus(companyId, "ACTIVE"),

            this._userRepo.countDevelopers(companyId),
            this._userRepo.countByStatus(companyId, "BLOCKED"),
            this._userRepo.countActiveDevelopers(companyId),

            this._taskRepo.countByCompany(companyId),
            this._taskRepo.countByStatus(companyId, "COMPLETED"),
            this._taskRepo.countOverdue(companyId),

            this._worklogRepo.getWorklogTrend(companyId),
            this._taskRepo.getProjectHealth(companyId),
            this._activityRepo.getRecentActivities(companyId)
        ]);

        return {
            totalProjects,
            activeProjects,

            totalDevelopers,
            activeDevelopers,
            blockedDevelopers,

            totalTasks,
            completedTasks,
            overdueTasks,

            worklogTrend,
            projectHealth,
            activityFeed
        };
    }
}
