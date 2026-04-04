export interface DeveloperDashboardStatsDto {
  assigned: number;
  pending: number;
  inProgress: number;
  completed: number;
  projects: number;
}
export interface DeveloperTaskItemDto {
  id: string;
  title: string;
  projectName: string;
  status: string;
  priority: string;
  dueDate: Date | null;
}

export interface ActivityDto {
  type: string;
  message: string;
  createdAt: Date;
}

export interface WorklogChartDto{
      date: string;
  hours: number;

}

export interface DeveloperDashboardResponseDto {
  stats: DeveloperDashboardStatsDto;
  tasks: DeveloperTaskItemDto[];
  recentActivity: ActivityDto[];
  worklogChart:WorklogChartDto[]
}