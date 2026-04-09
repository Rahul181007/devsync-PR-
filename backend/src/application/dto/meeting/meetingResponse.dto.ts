export interface MeetingResponseDTO {
    id: string;
    projectId: string;
    sprintId: string | null;

    title: string;
    description: string | null;

    scheduledAt: Date;
    durationMinutes: number | null;

    meetingLink: string | null;
    meetingType: "GOOGLE_MEET" | "ZOOM" | "TEAMS" | "OTHER" | null;

    notes: string | null;
    decisions: string | null;

    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";

    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}