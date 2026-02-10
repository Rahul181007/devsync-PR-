import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { ProjectTaskListItemDTO } from "../../dto/task/ProjectTaskListItem.dto";
import { IGetProjectTasksUseCase } from "../../interface/task/IGetBacklogTaskUseCase";

export class GetProjectTasksUseCase implements IGetProjectTasksUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _taskRepo:ITaskRepository,
        private _projectRepo:IProjectRepository,

    ){}
    async execute(userId: string, companyId: string, projectId: string): Promise<ProjectTaskListItemDTO[]> {
        const user=await this._userRepo.findById(userId);
        if(!user){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(user.role!==Role.COMPANY_ADMIN){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const project=await this._projectRepo.findById(projectId);

        if(!project){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

       if(project.companyId!==companyId){
        throw new AppError(
            RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
             HttpStatus.FORBIDDEN
        )
       }

       const tasks=await this._taskRepo.findByProjectId(projectId);
   
       return Promise.all(
        tasks.map(async(task)=>{
            let assignee=null;

            if(task.assigneeId){
                const user=await this._userRepo.findById(task.assigneeId);
                if(user){
                    assignee={
                        id:user.id,
                        name:user.name,
                        avatar:user.avatarUrl
                    }
                }
            }

            return {
                id:task.id,
                title:task.title,
                status:task.status,
                priority:task.priority,
                dueDate:task.dueDate,
                assignee
            }
        })
       )
    }
}