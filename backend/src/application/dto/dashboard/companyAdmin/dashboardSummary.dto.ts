export interface DashboardSummaryDTO {
  totalProjects: number;
  activeProjects: number;

  totalDevelopers: number;
  activeDevelopers: number;
  blockedDevelopers: number;

  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;

  worklogTrend: {
    date: string;
    hours: number;
  }[];
}

