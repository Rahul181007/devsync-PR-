import { TaskPriority, TaskType } from "../../../domain/entities/task.entity";

export interface UpdateTaskRequestDTO{
    title?:string;
    description?:string;
    type?:TaskType;
    priority?:TaskPriority;
    assigneeId?:string|null;
    dueDate?:Date|null

}