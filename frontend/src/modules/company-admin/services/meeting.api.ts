import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { CreateMeetingPayload, GetMeetingsResponse, UpdateMeetingPayload } from "../types/meeting.types";

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
    }){
            return http.get<{data:GetMeetingsResponse}>(
      API_ROUTES.COMPANY.MEETINGS(projectId),
      { params }
    );
    },

      updateMeeting(projectId: string, data: UpdateMeetingPayload) {
    return http.patch(
      API_ROUTES.COMPANY.MEETING_BY_ID(projectId, data.meetingId),
      data
    );
  }
}