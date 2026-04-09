import { TaskPriority, TaskStatus, TaskType } from "../../../domain/entities/task.entity";

export interface TaskDetailResponsDTO {
    id: string;
    code: string;

    title: string;
    description: string;
    status: TaskStatus;

    type:TaskType
     parentId: string | null 
    priority: TaskPriority;
    estimatedTime:number|null
        storyPoints?:number|null;

    sprint: {
        id: string;
        name: string;
    } | null

    assignee: {
        id: string;
        name: string;
        avatar: string | null;
    } | null

    reporter: {
        id: string;
        name: string;
    }

    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;

}