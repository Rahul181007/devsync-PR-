export interface SprintHistorySummaryItemDTO {
    sprintId: string;
    sprintName: string;
    sprintStatus: string;

    totalMembers: number;

    sprintStartDate: Date;
    sprintEndDate: Date;
    totalSprintDays: number;

    totalStandupsExpected: number;
    totalStandupsSubmitted: number;
    totalStandupsMissed: number;

    completionPercentage: number;
}

export interface GetSprintHistorySummaryResponseDTO {
  sprints: SprintHistorySummaryItemDTO[];
}