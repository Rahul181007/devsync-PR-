import { Meeting } from "../entities/meeting.entity";

export interface ListMeetingQuery {
    page: number;
    limit: number;
    projectId: string;
    sprintId?: string | null
    type?: string;
}

export interface CreateMeetingData {
    projectId: string;
    createdBy: string;
    sprintId?: string | null;

    title: string;
    description?: string | null;

    scheduledAt: Date;
    durationMinutes?: number | null;

    meetingLink?: string | null;
    meetingType?: "GOOGLE_MEET" | "ZOOM" | "TEAMS" | "OTHER" | null;
    type?: "SPRINT_PLANNING" | "SPRINT_REVIEW" | "STANDUP" | "GENERAL";
    isReminderSent?: boolean,
}


export interface IMeetingRepository {
    create(data: CreateMeetingData): Promise<Meeting>;

    findById(meetingId: string): Promise<Meeting | null>;

    findAll(query: ListMeetingQuery): Promise<{
        items: Meeting[],
        total: number
    }>

    save(meeting: Meeting): Promise<void>

    findByProject(projectId: string): Promise<Meeting[]>;
    findBySprint(sprintId: string): Promise<Meeting[]>;

    updateStatus(
        meetingId: string,
        status: "COMPLETED" | "CANCELLED"
    ): Promise<void>

    findTodayMeetings(projectId: string): Promise<Meeting[]>;
    findMissedMeetings(projectId: string): Promise<Meeting[]>;
    findCompletedMeetings(projectId: string): Promise<Meeting[]>
}