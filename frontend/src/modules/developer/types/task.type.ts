export type TaskStatus="BACKLOG"| "TODO"| "IN_PROGRESS"| "SUBMITTED"| "COMPLETED";
export type TaskPriority="LOW"|"MEDIUM"|"HIGH"

export interface DeveloperTaskCard {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string | null;
}
export interface DeveloperTaskBoard {
  backlog: DeveloperTaskCard[];
  todo: DeveloperTaskCard[];
  inProgress: DeveloperTaskCard[];
  submitted: DeveloperTaskCard[];
  completed: DeveloperTaskCard[];
}

export interface DeveloperTaskDetail {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}