export type ProjectHealth =
  | "ON_TRACK"
  | "AT_RISK"
  | "DELAYED";

export interface ProjectAISummary {
  health: ProjectHealth;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
  velocity: number;
  summary: string;
}