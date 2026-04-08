export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "SUBMITTED" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH"
export type TaskType =
  | "EPIC"
  | "STORY"
  | "TASK"
  | "BUG";

export interface TaskAssignee {
  id: string;
  name: string;
  avatar: string | null
}

export interface TaskListItem {
  id: string;
  code: string;
  title: string;

  type: TaskType;
  parentId: string | null
  status: TaskStatus;
  priority: TaskPriority;
  estimatedTime: number | null;
  dueDate: string | null;
  assignee: TaskAssignee | null;
  sprintId: string | null;

  storyPoints?: number;
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

  type: TaskType;
  parentId: string | null

  status: TaskStatus;
  priority: TaskPriority;
  estimatedTime: number | null;
  storyPoints?: number | null;
  

  sprint: TaskSprint | null;

  dueDate: string | null;

  assignee: TaskAssignee | null;

  submission: TaskSubmission | null;

  createdAt: string;
  updatedAt: string;
}


export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedByName?: string;
  createdAt: string;
}