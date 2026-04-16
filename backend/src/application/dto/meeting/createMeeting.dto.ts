export interface CreateMeetingDTO {
    projectId: string;
    sprintId?: string | null;

    title: string;
    description?: string;

    scheduledAt: Date;
    durationMinutes?: number;

    meetingLink?: string;
    meetingType?: "GOOGLE_MEET" | "ZOOM" | "TEAMS" | "OTHER";
     type?: "SPRINT_PLANNING" | "SPRINT_REVIEW" | "STANDUP" | "GENERAL";
}