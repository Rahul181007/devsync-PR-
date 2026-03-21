import { Worklog } from "../entities/workLog.entity";

export interface WorklogWithUser {
  id: string;

  taskId: string;
  taskTitle: string;

  userId: string;
  userName: string;

  timeSpent: number;
  description?: string;

  date: Date;
  createdAt: Date;
}
export interface IWorklogRepository {
  create(data: Partial<Worklog>): Promise<Worklog>;

  findByTaskId(taskId: string): Promise<Worklog[]>;

  findByProjectId(projectId: string): Promise<Worklog[]>;

  findByUserId(userId: string): Promise<Worklog[]>;

  findById(id: string): Promise<Worklog | null>;
  findByProjectIdWithUser(projectId: string): Promise<WorklogWithUser[]>;

  update(worklog: Worklog): Promise<Worklog>;
  delete(id: string): Promise<void>;
}
