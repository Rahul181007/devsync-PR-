export interface UpdateMeetingDTO {
    meetingId: string;

    notes?: string | null;
    decisions?: string | null;

    status?: "COMPLETED" | "CANCELLED";
    meetingLink?: string | null;
}