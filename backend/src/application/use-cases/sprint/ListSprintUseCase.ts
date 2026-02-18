import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { SprintResponseDTO } from "../../dto/sprint/sprintResponse.dto";
import { IListSprintUseCase } from "../../interface/sprint/IListSprintUseCase";

export class ListSprintUseCase implements IListSprintUseCase{
    constructor(
        private _sprintRepo:ISprintRepository,
        private _userRepo:IUserRepository,
        private _projectRepo:IProjectRepository
    ){}
    async execute(userId: string, companyId: string, projectId: string): Promise<SprintResponseDTO[]> {
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)

        }

        if(user.role!==Role.COMPANY_ADMIN){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }

        const project=await this._projectRepo.findById(projectId);
        if(!project){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }

        if(project.companyId!==companyId){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const sprints =await this._sprintRepo.findByProjectId(projectId);

    return sprints.map((sprint) => ({
      id: sprint.id,
      projectId: sprint.projectId,
      name: sprint.name,
      goal: sprint.goal,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      status: sprint.status,
      createdBy: sprint.createdBy,
      createdAt: sprint.createdAt,
      updatedAt: sprint.updatedAt,
    }));

    }
}