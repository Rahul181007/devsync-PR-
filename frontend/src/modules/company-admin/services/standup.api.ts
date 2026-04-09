import { http } from "../../../core/api/http"
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { SprintHistoryItem, StandupDetail, TodayStandupSummary } from "../types/standup.type";

export const companyStandupApi = {
  getToday(projectId: string) {
    return http.get<{ success: boolean; data: TodayStandupSummary }>(
      API_ROUTES.COMPANY.STANDUP_TODAY(projectId)
    )
  },
  getHistory(projectId: string) {
    return http.get<{ success: boolean; data: { sprints: SprintHistoryItem[] } }>(
      API_ROUTES.COMPANY.STANDUP_HISTORY(projectId)
    );
  },
  getStandupDetail(projectId: string, standupId: string) {
    return http.get<{
      success: boolean;
      data: StandupDetail;
    }>(API_ROUTES.COMPANY.STANDUP_DETAIL(projectId, standupId));
  }

}