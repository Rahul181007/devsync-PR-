import { TaskPriority, TaskStatus, TaskType } from "../../../domain/entities/task.entity";


export interface TaskResponseDTO{
    id:string;

    companyId:string;
    projectId:string;
    sprintId:string|null;
    parentId:string|null;

    code:string;
    title:string;
    description:string;

    type:TaskType;

    status:TaskStatus;
    priority:TaskPriority;
    estimatedTime?: number | null;

    assigneeId:string|null;
    reporterId:string;

    dueDate:Date|null;

    createdAt:Date;
    updatedAt:Date;
}