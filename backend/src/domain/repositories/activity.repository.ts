export interface ActivityItem {
  type: "TASK_COMPLETED" | "WORKLOG_ADDED";
  message: string;
  createdAt: Date;
}

export interface IActivityRepository {
  getRecentActivities(companyId: string): Promise<ActivityItem[]>;
  getRecentActivitiesByUser(userId: string): Promise<ActivityItem[]>;
}

