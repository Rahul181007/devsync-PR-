import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { GetMeetingsResponse, Meeting } from "../types/meeting.types";

export const developerMeetingApi = {
  getMeetings(projectId: string, params: {
    page?: number;
    limit?: number;
    sprintId?: string;
    type?: string;
  }) {
    return http.get<{data:GetMeetingsResponse}>(
      API_ROUTES.DEVELOPER.MEETINGS(projectId),
      { params }
    );
  },

    getTodayMeetings(projectId: string) {
      return http.get(
        API_ROUTES.DEVELOPER.TODAYS_MEETINGS(projectId)
      )
    },
  
    getMissedMeetings(projectId: string) {
      return http.get<{ data: { items: Meeting[] } }>(
          API_ROUTES.DEVELOPER.MISSED_MEETINGS(projectId)
      );
  },
  

};