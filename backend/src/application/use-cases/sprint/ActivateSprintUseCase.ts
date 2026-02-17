import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ISprintRepository } from "../../../domain/repositories/sprint.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { IActivateSprintUseCase } from "../../interface/sprint/IActivateSprintUseCase";

export class ActivateSprintUseCase implements IActivateSprintUseCase{
    constructor(
        private _sprintRepo:ISprintRepository,
        private _projectRepo:IProjectRepository,
        private _taskRepo:ITaskRepository,
        private _userRepo:IUserRepository
    ){}

    async execute(userId: string, companyId: string, projectId: string, sprintId: string): Promise<void> {
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(user.role!==Role.COMPANY_ADMIN){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN)
        }
        const project=await this._projectRepo.findById(projectId);
        if(!project){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }
        if(project.companyId!=companyId){
            throw new AppError(RESPONSE_MESSAGES.PROJECT.COMPANY_ID_NOT_MATCHING,HttpStatus.FORBIDDEN)
        }

        const sprint =await this._sprintRepo.findById(sprintId);
        if(!sprint){
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(sprint.projectId!==projectId){
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_BELONG_PROJECT,HttpStatus.FORBIDDEN)
        }
        if(sprint.status!=="PLANNED"){
            throw new AppError(RESPONSE_MESSAGES.SPRINT.SPRINT_NOT_PLANNABLE,HttpStatus.BAD_REQUEST)
        }

        const activeSprint =await this._sprintRepo.findActiveSprint(projectId);
        if(activeSprint){
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.ACTIVE_SPRINT_EXISTS,
                HttpStatus.CONFLICT

            )
        }

        const task=await this._taskRepo.findByProjectId(projectId);
        const sprintTasks=task.filter((task)=>task.sprintId===sprintId);
        if(sprintTasks.length===0){
            throw new AppError(
                RESPONSE_MESSAGES.SPRINT.SPRINT_EMPTY,HttpStatus.BAD_REQUEST
            )
        }

        sprint.status="ACTIVE";
        await this._sprintRepo.update(sprint);

        project.currentSprintId=sprintId;
        await this._projectRepo.update(projectId,{currentSprintId:sprintId})
    }
}