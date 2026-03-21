import { TaskPriority, TaskStatus, TaskType } from "../../../domain/entities/task.entity";

export interface DeveloperTaskDetailDTO {
  id: string;
  title: string;
  description: string;
  type: TaskType
  parentId: string | null
  status: TaskStatus;
  priority: TaskPriority;
  estimatedTime: number | null;
  dueDate: Date | null;
}