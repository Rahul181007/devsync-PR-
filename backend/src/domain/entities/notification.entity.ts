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

  export class Notification{
    constructor(
        public readonly id:string,
        public readonly userId:string,
        public readonly type:NotificationType,
        public readonly title:string,
        public readonly message:string,
        public readonly metadata:Record<string,unknown>|null,
        public isRead:boolean,
        public readonly createdAt:Date
    ){}
  }