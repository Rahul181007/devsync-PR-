export interface WorklogTrendItem {
  date: string;
  hours: number;
}

export interface ProjectHealthItem {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  health: number;
}

export interface ActivityItem {
  type: "TASK_COMPLETED" | "WORKLOG_ADDED";
  message: string;
  createdAt: string;
}
export interface CompanyDashboardData {
  totalProjects: number;
  activeProjects: number;

  totalDevelopers: number;
  activeDevelopers: number;
  blockedDevelopers: number;

  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;

  worklogTrend: WorklogTrendItem[];
  projectHealth: ProjectHealthItem[];
  activityFeed: ActivityItem[];
}


