import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IWorklogRepository } from "../../../domain/repositories/worklog.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { CreateWorklogRequestDTO } from "../../dto/worklog/createWorklog.dto";
import { ICreateWorklogUseCase } from "../../interface/worklog/ICreateWorklogUseCase";

export class CreateWorklogUseCase implements ICreateWorklogUseCase {
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
    data: CreateWorklogRequestDTO,
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

    const task = await this._taskRepo.findById(taskId);
    if (!task) {
      throw new AppError(
        RESPONSE_MESSAGES.TASK.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (task.status === "COMPLETED") {
  throw new AppError(
    RESPONSE_MESSAGES.WORKLOG.TASK_ALREADY_COMPLETED,
    HttpStatus.BAD_REQUEST
  );
}

    if (task.projectId !== projectId) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
      );
    }
    if (task.assigneeId !== userId) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        HttpStatus.FORBIDDEN,
      );
    }
    if (data.timeSpent <= 0) {
      throw new AppError(
        RESPONSE_MESSAGES.WORKLOG.INVALID_TIME_SPENT,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.date && data.date > new Date()) {
      throw new AppError(
        RESPONSE_MESSAGES.WORKLOG.INVALID_DATE,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this._worklogRepo.create({
      companyId,
      projectId,
      taskId,
      userId,
      timeSpent: data.timeSpent,
      description: data.description,
      date: data.date ?? new Date(),
    });
  }
}
