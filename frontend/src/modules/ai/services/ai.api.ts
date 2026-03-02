import { http } from "../../../core/api/http";
import type { ProjectAISummary } from "../types/ai.types";

export const aiApi = {
  getProjectAISummary(projectId: string) {
    return http.get<{ success: boolean; data: ProjectAISummary }>(
      `/projects/${projectId}/ai-summary`
    );
  },
};