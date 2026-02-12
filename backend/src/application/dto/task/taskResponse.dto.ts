import { TaskPriority, TaskStatus } from "../../../domain/entities/task.entity";


export interface TaskResponseDTO{
    id:string;

    companyId:string;
    projectId:string;
    sprintId:string|null;

    code:string;
    title:string;
    description:string;

    status:TaskStatus;
    priority:TaskPriority;

    assigneeId:string|null;
    reporterId:string;

    dueDate:Date|null;

    createdAt:Date;
    updatedAt:Date;
}