export interface WorklogProjectItemDTO {
  id: string;

  taskId: string;
  taskTitle: string

  userId: string;
  userName: string;

  timeSpent: number;
  description?: string;

  date: Date;
  createdAt: Date;
}