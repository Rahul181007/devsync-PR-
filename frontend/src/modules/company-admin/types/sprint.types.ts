export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";
export interface SprintListItems {
    id: string;
    name: string;
    goal: string | null;
    startDate: string;
    endDate: string;
    status: SprintStatus
}

export interface SprintDetail {
    id: string;
    projectId: string;
    name: string;
    goal: string | null;
    startDate: string;
    endDate: string;
    status: SprintStatus;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface PlanSprintTaskItem{
    taskId:string;
    developerId:string
}
export interface PlanSprintRequest {
  sprintId: string;
  storyIds: string[];
}


