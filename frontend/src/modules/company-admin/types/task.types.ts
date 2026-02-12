export type TaskStatus="BACKLOG"| "TODO"| "IN_PROGRESS"| "SUBMITTED"| "COMPLETED";
export type TaskPriority="LOW"|"MEDIUM"|"HIGH"


export interface TaskAssignee{
    id:string;
    name:string;
    avatar:string|null
}

export interface TaskListItem {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; 
  assignee: TaskAssignee | null;
}

export interface TaskSubmission {
  summary: string;
  workDone: string;
  blockers: string | null;
  submittedAt: string;
}
export interface TaskSprint {
  id: string;
  name: string;
}


export interface TaskDetail {
  id: string;
  code: string;

  title: string;
  description: string;

  status: TaskStatus;
  priority: TaskPriority;

  sprint: TaskSprint | null;

  dueDate: string | null;

  assignee: TaskAssignee | null;

  submission: TaskSubmission | null;

  createdAt: string;
  updatedAt: string;
}
