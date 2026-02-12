
import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { ITaskRepository } from "../../../domain/repositories/task.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { DeveloperTaskBoardDTO } from "../../dto/task/DeveloperTaskBoard.dto";
import { IGetDeveloperTasksUseCase } from "../../interface/task/IGetDeveloperTasksUseCase";

export class GetDeveloperTasksUseCase implements IGetDeveloperTasksUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _taskRepo:ITaskRepository,
        private _projectRepo:IProjectRepository,
        private _projectMemberRepo:IProjectMemberRepository
    ){}

    async execute(userId: string, projectId: string): Promise<DeveloperTaskBoardDTO> {
        const user=await this._userRepo.findById(userId);
        if(!user|| user.role!==Role.DEVELOPER){
            throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,HttpStatus.FORBIDDEN);
        }

        const project=await this._projectRepo.findById(projectId);

        if(!project){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        if(project.companyId!==user.companyId){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.UNAUTHORIZED,
                HttpStatus.FORBIDDEN
            )
        }

        const isMember=await this._projectMemberRepo.isMember(projectId,userId);
        if(!isMember){
            throw new AppError(
                RESPONSE_MESSAGES.PROJECT.MEMBER_NOT_FOUND,
                HttpStatus.FORBIDDEN
            )
        }

        if(!project.currentSprintId){
            return {
                backlog:[],
                todo:[],
                inProgress:[],
                submitted:[],
                completed:[]
            }
        }

        const tasks=await this._taskRepo.findByAssigneeAndSprint(userId,project.currentSprintId)

        const board:DeveloperTaskBoardDTO={
            backlog:[],
            todo:[],
            inProgress:[],
            submitted:[],
            completed:[]
        }

        for(const task of tasks){
            const card={
                id:task.id,
                title:task.title,
                priority:task.priority,
                dueDate:task.dueDate
            }

            switch (task.status){
                case "BACKLOG":
                board.backlog.push(card);
                break;
                case "TODO":
                board.todo.push(card);
                break;
                case "IN_PROGRESS":
                board.inProgress.push(card);
                break;
                case "SUBMITTED":
                board.submitted.push(card);
                break;
                case "COMPLETED":
                board.completed.push(card)
                break
            }
        }

        return board
       
    }
}