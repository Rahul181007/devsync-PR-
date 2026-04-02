export interface CompanyDashboardData {
  totalProjects: number;
  activeProjects: number;

  totalDevelopers: number;
  activeDevelopers: number;
  blockedDevelopers: number;

  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}