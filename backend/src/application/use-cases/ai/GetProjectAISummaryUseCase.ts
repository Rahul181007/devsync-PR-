import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IProjectAIService } from "../../../domain/service/project-ai.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { ProjectAISummaryDTO } from "../../dto/ai/projectAISummary.dto";
import { IGetProjectAISummaryUseCase } from "../../interface/ai/IGetProjectAISummaryUseCase";

export class GetProjectAISummaryUseCase implements IGetProjectAISummaryUseCase {
    constructor(
        private _projectRepo: IProjectRepository,
        private _taskRepo: ITaskRepository,
        private _userRepo: IUserRepository,
        private _projectMemberRepo: IProjectMemberRepository,
        private _projectAIService: IProjectAIService
    ) { }

    async execute(userId: string, companyId: string, projectId: string): Promise<ProjectAISummaryDTO> {
        const user = await this._userRepo.findById(userId);

        if (!user) {
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if (
            user.role !== Role.COMPANY_ADMIN &&
            user.role !== Role.DEVELOPER
        ) {
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
            )
        }

        if (project.companyId !== companyId) {
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING,
                HttpStatus.FORBIDDEN
            )
        }

        if (user.role === Role.DEVELOPER) {
            const isMember = await this._projectMemberRepo.isMember(projectId, user.id)

            if (!isMember) {
                throw new AppError(
                    RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                    HttpStatus.FORBIDDEN
                )
            }
        }
        let tasks = await this._taskRepo.findByProjectId(projectId);
        if (user.role === Role.DEVELOPER) {
            tasks = tasks.filter((task) => task.assigneeId === userId)
        }

        const aiSummary = this._projectAIService.generateSummary({
            tasks,
            currentDate: new Date()
        })

        return {
            health: aiSummary.health,
            totalTasks: aiSummary.totalTasks,
            completedTasks: aiSummary.completedTasks,
            pendingTasks: aiSummary.pendingTasks,
            overdueTasks: aiSummary.overdueTasks,
            upcomingTasks: aiSummary.upcomingTasks,
            velocity: aiSummary.velocity,
            summary: aiSummary.summary
        }
    }
}