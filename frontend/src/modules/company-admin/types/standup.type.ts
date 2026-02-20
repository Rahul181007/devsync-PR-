export type StandupStatus = "SUBMITTED" | "PARTIAL" | "MISSED";

export interface StandupMember {
    userId: string;
    name: string;
    status: StandupStatus;
    mood: string | null;
    standupId: string | null
}

export interface TodayStandupSummary {
    sprintId: string;
    sprintStatus: string;
    totalMembers: number;
    submittedCount: number;
    partialCount: number;
    missedCount: number;
    completionPercentage: number;
    members: StandupMember[];
}

export interface SprintHistoryItem {
  sprintId: string;
  sprintName: string;
  sprintStatus: string;
  totalMembers: number;
  sprintStartDate: string;
  sprintEndDate: string;
  totalSprintDays: number;
  totalStandupsExpected: number;
  totalStandupsSubmitted: number;
  totalStandupsMissed: number;
  completionPercentage: number;
}

export interface StandupDetail {
  id: string;
  projectId: string;
  companyId: string;
  sprintId: string;
  userId: string;
  standupDate: string;
  yesterday: string;
  today: string;
  blockers: string | null;
  mood: "HAPPY" | "GOOD" | "NEUTRAL" | "STRESSED" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
}