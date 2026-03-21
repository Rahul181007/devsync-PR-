import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWorklogRepository } from "../../../domain/repositories/worklog.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { GetWorklogsByProjectRequestDTO } from "../../dto/worklog/getWorklogsByProjectRequest.dto"; 
import { WorklogProjectItemDTO } from "../../dto/worklog/getWorklogsByProjectResponse.dto";
import { IGetWorklogsByProjectUseCase } from "../../interface/worklog/IGetWorklogsByProjectUseCase";

export class GetWorklogsByProjectUseCase implements IGetWorklogsByProjectUseCase {
  constructor(
    private _worklogRepo: IWorklogRepository,
    private _projectMemberRepo: IProjectMemberRepository,
    private _projectRepo: IProjectRepository,
    private _userRepo: IUserRepository,
  ) {}

  async execute(
    userId: string,
    companyId: string,
    projectId: string,
    query: GetWorklogsByProjectRequestDTO,
  ): Promise<WorklogProjectItemDTO[]> {
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

    // ✅ 4. Fetch (with populate)
    const worklogs = await this._worklogRepo.findByProjectIdWithUser(projectId);

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

    // ✅ 6. Map to DTO
    return filtered.map((log) => ({
      id: log.id,
      taskId: log.taskId,
      taskTitle:log.taskTitle,

      userId: log.userId,
      userName: log.userName,

      timeSpent: log.timeSpent,
      description: log.description,

      date: log.date,
      createdAt: log.createdAt,
    }));
  }
}
