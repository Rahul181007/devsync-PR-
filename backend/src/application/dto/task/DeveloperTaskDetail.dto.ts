import { TaskPriority, TaskStatus } from "../../../domain/entities/task.entity";

export interface DeveloperTaskDetailDTO {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
}