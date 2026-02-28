import { ProjectHealth } from "../../../domain/service/project-ai.service";

export interface ProjectAISummaryDTO{
    health:ProjectHealth;

      totalTasks: number;
  completedTasks: number;
  pendingTasks: number;

  overdueTasks: number;
  upcomingTasks: number;

  velocity: number;

  summary: string;
}