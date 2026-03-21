import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWorklogRepository } from "../../../domain/repositories/worklog.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { WorklogItemDTO } from "../../dto/worklog/getWorklogByTask.dto";
import { IGetWorklogsByTaskUseCase1 } from "../../interface/worklog/IGetWorklogsByTaskUseCase";

export class GetWorklogsByTaskUseCase implements IGetWorklogsByTaskUseCase1 {
  constructor(
    private _worklogRepo: IWorklogRepository,
    private _taskRepo: ITaskRepository,
    private _projectMemberRepo: IProjectMemberRepository,
    private _projectRepo: IProjectRepository,
    private _userRepo: IUserRepository,
  ) {}

  async execute(
    userId: string,
    companyId: string,
    projectId: string,
    taskId: string,
  ): Promise<WorklogItemDTO[]> {
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
        RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING,
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

    const task = await this._taskRepo.findById(taskId);
    if (!task) {
      throw new AppError(
        RESPONSE_MESSAGES.TASK.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (task.projectId !== projectId) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
      );
    }


    const worklogs = await this._worklogRepo.findByTaskId(taskId);

   
    return worklogs.map((log) => ({
      id: log.id,
      userId: log.userId,
      timeSpent: log.timeSpent,
      description: log.description,
      date: log.date,
      createdAt: log.createdAt,
    }));
  }
}
