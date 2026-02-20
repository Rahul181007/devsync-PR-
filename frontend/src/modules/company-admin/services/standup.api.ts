import { http } from "../../../core/api/http"
import type { SprintHistoryItem, StandupDetail, TodayStandupSummary } from "../types/standup.type";

export const companyStandupApi={
    getToday(projectId:string){
        return http.get<{success: boolean; data: TodayStandupSummary }>(
            `/company/projects/${projectId}/standups/today`
        )
    },
      getHistory(projectId: string) {
    return http.get<{ success: boolean; data: { sprints: SprintHistoryItem[] } }>(
      `/company/projects/${projectId}/standups/history`
    );
  },
getStandupDetail(projectId: string, standupId: string) {
  return http.get<{
    success: boolean;
    data: StandupDetail;
  }>(`/company/projects/${projectId}/standups/${standupId}`);
}
  
}