// 🔹 Base Meeting
export interface Meeting {
  id: string;
  projectId: string;
  sprintId: string | null;

  title: string;
  description: string | null;

  scheduledAt: string; // ISO string (from backend)
  durationMinutes: number | null;

  meetingLink: string | null;
  meetingType: "GOOGLE_MEET" | "ZOOM" | "TEAMS" | "OTHER" | null;
  type: "SPRINT_PLANNING" | "SPRINT_REVIEW" | "STANDUP" | "GENERAL";
  notes: string | null;
  decisions: string | null;

  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";

  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingPayload {

  sprintId?: string | null;

  title: string;
  description?: string;

  scheduledAt: string; // send as ISO string
  durationMinutes?: number;

  meetingLink?: string;
  meetingType?: "GOOGLE_MEET" | "ZOOM" | "TEAMS" | "OTHER";
}

export interface GetMeetingsQuery {
  projectId: string;
  page?: number;
  limit?: number;
  sprintId?: string;
}

export interface GetMeetingsResponse {
  items: Meeting[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateMeetingPayload {
  meetingId: string;

  notes?: string | null;
  decisions?: string | null;

   meetingLink?: string | null; 

  status?: "COMPLETED" | "CANCELLED";
}

