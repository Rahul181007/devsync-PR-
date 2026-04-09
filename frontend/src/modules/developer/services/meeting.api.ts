import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { GetMeetingsResponse } from "../types/meeting.types";

export const developerMeetingApi = {
  getMeetings(projectId: string, params: {
    page?: number;
    limit?: number;
    sprintId?: string;
  }) {
    return http.get<{data:GetMeetingsResponse}>(
      API_ROUTES.DEVELOPER.MEETINGS(projectId),
      { params }
    );
  },
};