import { TaskPriority } from "../../../domain/entities/task.entity";


export interface CreateTaskRequestDTO{
    title:string;
    description:string;

    priority:TaskPriority;

    assigneeId?:string|null;
    dueDate?:Date|null
}