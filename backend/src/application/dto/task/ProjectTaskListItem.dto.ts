import { TaskPriority, TaskStatus, TaskType } from "../../../domain/entities/task.entity";

export interface ProjectTaskListItemDTO {
    id: string;
    code: string;
    title: string;
    type: TaskType
    parentId: string | null
    status: TaskStatus;
    priority: TaskPriority;
    estimatedTime: number | null;
    dueDate: Date | null;
    sprintId: string | null
    assignee: {
        id: string;
        name: string;
        avatarUrl?: string
    } | null
}