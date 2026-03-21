import { TaskPriority, TaskType } from "../../../domain/entities/task.entity";


export interface CreateTaskRequestDTO {
    title: string;
    description: string;

    type?: TaskType;

    priority: TaskPriority;
    parentId?: string | null;

    assigneeId?: string | null;
    dueDate?: Date | null
    estimatedTime?: number;
}