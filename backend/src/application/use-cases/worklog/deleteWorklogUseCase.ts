import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWorklogRepository } from "../../../domain/repositories/worklog.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { IDeleteWorklogUseCase } from "../../interface/worklog/IDeleteWorklogUseCase";

export class DeleteWorklogUseCase implements IDeleteWorklogUseCase {
  constructor(
    private _worklogRepo: IWorklogRepository,
    private _projectRepo: IProjectRepository,
    private _projectMemberRepo: IProjectMemberRepository,
    private _userRepo: IUserRepository,
    private _taskRepo: ITaskRepository,
  ) {}

  async execute(
    userId: string,
    companyId: string,
    projectId: string,
    worklogId: string,
  ): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.role !== "DEVELOPER") {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
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

    const worklog = await this._worklogRepo.findById(worklogId);
    if (!worklog) {
      throw new AppError(
        RESPONSE_MESSAGES.WORKLOG.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (worklog.userId !== userId) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
      );
    }

    const logDate = new Date(worklog.date);
const today = new Date();

const isSameDay =
  logDate.getFullYear() === today.getFullYear() &&
  logDate.getMonth() === today.getMonth() &&
  logDate.getDate() === today.getDate();

if (!isSameDay) {
  throw new AppError(
    "Worklog can only be edited on the same day",
    HttpStatus.FORBIDDEN
  );
}
    const task = await this._taskRepo.findById(worklog.taskId);
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

    await this._worklogRepo.delete(worklogId);
  }
}
