import { TaskPriority, TaskStatus } from "../../../domain/entities/task.entity";

export interface TaskDetailResponsDTO {
    id: string;
    code: string;

    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;

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