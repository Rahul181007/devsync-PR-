
export type NotificationType =
  | "COMPANY_APPROVED"
  | "COMPANY_REJECTED"
  | "COMPANY_SUSPENDED"
  | "COMPANY_REACTIVATED"
  | "TASK_ASSIGNED"
  | "TASK_SUBMITTED"
  | "SPRINT_STARTED"
  | "SPRINT_COMPLETED"
  | "AI_PROJECT_DELAYED"
  |'COMPANY_SUBMITTED_FOR_APPROVAL'
  |"COMPANY_REAPPLIED";

  export interface Notification{
    id:string;
    type:NotificationType;
    title:string;
    message:string;
    metadata?:Record<string,unknown>|null;
    isRead:boolean;
    createdAt:string;

  }

  export interface NotificationResponse{
    success:boolean;
    data:Notification[]
  }