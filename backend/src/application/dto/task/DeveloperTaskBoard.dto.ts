import { TaskPriority } from "../../../domain/entities/task.entity";

export interface DeveloperTaskBoardDTO{
    backlog:TaskCardDTO[];
    todo:TaskCardDTO[];
    inProgress:TaskCardDTO[];
    submitted:TaskCardDTO[];
    completed:TaskCardDTO[]
}
export interface TaskCardDTO{
    id:string;
    title:string;
    priority:TaskPriority;
    dueDate:Date|null;
}