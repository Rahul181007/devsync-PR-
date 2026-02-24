import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IStandupRepository } from "../../../domain/repositories/standup.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { GetStandupDetailResponseDTO } from "../../dto/standup/getStandupDetailResponse.dto";
import { IGetStandupDetailForCompanyUseCase } from "../../interface/standup/IGetStandupDetailForCompanyUseCase";

export class GetStandupDetailForCompanyUseCase implements IGetStandupDetailForCompanyUseCase{
    constructor(
      private _standupRepo:IStandupRepository,
      private _projectRepo:IProjectRepository,
      private _userRepo:IUserRepository

    ){}

    async execute(userId: string, companyId: string, projectId: string, standupId: string): Promise<GetStandupDetailResponseDTO> {
        const user=await this._userRepo.findById(userId);
            if (!user) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
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
   const standup = await this._standupRepo.findById(standupId);
    if (!standup) {
      throw new AppError(
        RESPONSE_MESSAGES.STANDUP.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    if (standup.projectId !== projectId) {
      throw new AppError(
        RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
        HttpStatus.FORBIDDEN
      );
    }

    return {
      id: standup.id,
      projectId: standup.projectId,
      companyId: standup.companyId,
      sprintId: standup.sprintId,
      userId: standup.userId,
      standupDate: standup.standupDate,
      yesterday: standup.yesterday,
      today: standup.today,
      blockers: standup.blockers,
      mood: standup.mood,
      createdAt: standup.createdAt,
      updatedAt: standup.updatedAt,
    };
  }
}