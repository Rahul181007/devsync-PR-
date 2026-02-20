export interface SprintTodayStandupMemberDTO{
    userId:string;
    name:string;
    status:"SUBMITTED"|"MISSED"|"PARTIAL";
    mood:"HAPPY" | "GOOD" | "NEUTRAL" | "STRESSED" | "BLOCKED" | null;
    standupId:string|null
}

export interface GetSprintTodayStandupSummaryResponseDTO{
    sprintId: string;
  sprintStatus: string;
  totalMembers: number;
  submittedCount: number;
  partialCount:number;
  missedCount: number;
  completionPercentage: number;
  members: SprintTodayStandupMemberDTO[];
}