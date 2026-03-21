export interface WorklogItemDTO {
  id: string;

  userId: string;

  timeSpent: number;
  description?: string;

  date: Date;

  createdAt: Date;
}