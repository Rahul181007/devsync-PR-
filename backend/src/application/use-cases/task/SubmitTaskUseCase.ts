import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { SubmitTaskDTO } from "../../dto/task/SubmitTask.dto";
import { ISubmitTaskUseCase } from "../../interface/task/ISubmitTaskUseCase";

export class SubmitTaskUseCase implements ISubmitTaskUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _taskRepo: ITaskRepository,
    private _projectRepo: IProjectRepository,
    private _projectMembarRepo: IProjectMemberRepository
  ) { }

  async execute(userId: string, projectId: string, taskId: string, data: SubmitTaskDTO): Promise<void> {
    const user = await this._userRepo.findById(userId);
    console.log(user)
    if (!user || user.role !== Role.DEVELOPER) {
      throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
    }

    const project = await this._projectRepo.findById(projectId);
    console.log(project)

    if (!project || project.companyId !== user.companyId) {
      throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN)
    }

    if (project.status !== "ACTIVE") {
      throw new AppError(
        RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_ACTIVE,
        HttpStatus.BAD_REQUEST
      );
    }


    const isMember = await this._projectMembarRepo.isMember(projectId, userId);
    if (!isMember) {
      throw new AppError(
        RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND, HttpStatus.FORBIDDEN
      )
    }
    const task = await this._taskRepo.findById(taskId);
    if (!task || task.projectId !== projectId) {
      throw new AppError(RESPONSE_MESSAGES.TASK.NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if (task.assigneeId !== userId) {
      throw new AppError(
        RESPONSE_MESSAGES.TASK.NOT_ASSIGNED_TO_YOU,
        HttpStatus.FORBIDDEN
      )
    }

    if (!task.sprintId) {
      throw new AppError(RESPONSE_MESSAGES.TASK.NOT_IN_SPRINT, HttpStatus.BAD_REQUEST)
    }

    if (task.sprintId !== project.currentSprintId) {
      throw new AppError(
        RESPONSE_MESSAGES.TASK.INVALID_STATUS_TRANSITION, HttpStatus.BAD_REQUEST
      )
    }

    task.status = "SUBMITTED";
    task.submission = {
      summary: data.summary,
      workDone: data.workDone,
      blockers: data.blockers ?? null,
      submittedAt: new Date()
    }

    await this._taskRepo.update(task)
  }
}