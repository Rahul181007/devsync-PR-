export interface AdminWorklogItem {
  id: string;
  userId: string;
  userName: string;
  timeSpent: number; // minutes
  description: string;
  date: string;
}

export interface ProjectWorklogItem {
  id: string;
  userId: string;
  userName: string;   // or reuse assignee if keeping simple
  taskId: string;
  taskTitle: string;
  timeSpent: number;
  description: string;
  date: string;
}

export interface ProjectTimesheetItem {
  date: string;
  totalHours: number;
  userName?: string;

  tasks?: {
    taskTitle: string;
    timeSpent: number;
  }[];

  meetings?: {                 
    title: string;
    duration: number;
  }[];

  unloggedHours?: number;      
}