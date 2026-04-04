export interface DeveloperStats {
  assigned: number;
  pending: number;
  inProgress: number;
  completed: number;
  projects: number;
}

export interface DeveloperTaskItem {
  id: string;
  title: string;
  projectName: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
}

export interface DeveloperActivityItem {
  type: "TASK_COMPLETED" | "WORKLOG_ADDED";
  message: string;
  createdAt: string;
}

export interface WorklogChartItem {
  date: string; // Mon, Tue...
  hours: number;
}

export interface DeveloperDashboardData {
  stats: DeveloperStats;
  tasks: DeveloperTaskItem[];
  recentActivity: DeveloperActivityItem[];
  worklogChart: WorklogChartItem[];
}