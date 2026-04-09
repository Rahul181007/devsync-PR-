import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { ProjectAISummary } from "../types/ai.types";

export const aiApi = {
  getProjectAISummary(projectId: string) {
    return http.get<{ success: boolean; data: ProjectAISummary }>(
      API_ROUTES.COLLAB.AI_SUMMARY(projectId)
    );
  },
};