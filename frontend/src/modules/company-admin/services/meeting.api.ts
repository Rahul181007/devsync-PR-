import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { CreateMeetingPayload, GetMeetingsResponse, Meeting, UpdateMeetingPayload } from "../types/meeting.types";

export const meetingApi = {
  createMeeting(projectId: string, data: CreateMeetingPayload) {
    return http.post<{ message: string }>(
      API_ROUTES.COMPANY.MEETINGS(projectId),
      data
    )
  },

  getMeetings(projectId: string, params?: {
    page?: number;
    limit?: number;
    sprintId?: string;
    type?: string;
  }) {
    return http.get<{ data: GetMeetingsResponse }>(
      API_ROUTES.COMPANY.MEETINGS(projectId),
      { params }
    );
  },

  updateMeeting(projectId: string, data: UpdateMeetingPayload) {
    return http.patch(
      API_ROUTES.COMPANY.MEETING_BY_ID(projectId, data.meetingId),
      data
    );
  },
  getTodayMeetings(projectId: string) {
    return http.get(
      API_ROUTES.COMPANY.TODAYS_MEETINGS(projectId)
    )
  },

  getMissedMeetings(projectId: string) {
    return http.get<{ data: { items: Meeting[] } }>(
        API_ROUTES.COMPANY.MISSED_MEETINGS(projectId)
    );
},

  getCompletedMeetings(projectId: string) {
    return http.get<{ data: { items: Meeting[] } }>(
        API_ROUTES.COMPANY.COMPLETED_MEETINGS(projectId)
    );
}
}