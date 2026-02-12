export type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "COMPLETED";

  
  export type TaskSubmission = {
  summary: string;
  workDone: string;
  blockers: string | null;
  submittedAt: Date;
};

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export class Task {
    constructor(
        public readonly id: string,
        public readonly companyId: string,
        public readonly projectId: string,

        public sprintId: string | null,

        public code: string,
        public title: string,
        public description: string,

        public status: TaskStatus,
        public priority: TaskPriority,

        public assigneeId: string | null,
        public reporterId: string,

        public dueDate: Date | null,



        public readonly createdAt: Date,
        public updatedAt: Date,

        public submission?: TaskSubmission | null,
    ) { }
}