import { DeveloperTaskBoardDTO } from "../../dto/task/DeveloperTaskBoard.dto";

export interface IGetDeveloperTasksUseCase{
    execute(userId:string,projectId:string):Promise<DeveloperTaskBoardDTO>
}