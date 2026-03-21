import { http } from "../../../core/api/http";
import type { WorklogItem } from "../types/worklog.types";

export const worklogApi = {

  
  createWorklog(
    projectId: string,
    taskId: string,
    data: {
      timeSpent: number;
      description?: string;
      date?: string;
    }
  ) {
    return http.post<{ success: boolean }>(
      `/developer/projects/${projectId}/tasks/${taskId}/worklogs`,
      data
    );
  },

  
  getWorklogsByTask(projectId: string, taskId: string) {
    return http.get<{ success: boolean; data: WorklogItem[] }>(
      `/projects/${projectId}/tasks/${taskId}/worklogs`
    );
  },

   updateWorklog(
    projectId: string,
    worklogId: string,
    data: {
      timeSpent?: number;
      description?: string;
      date?: string;
    }
  ) {
    return http.patch(
      `/developer/projects/${projectId}/worklogs/${worklogId}`,
      data
    );
  },

    deleteWorklog(projectId: string, worklogId: string) {
    return http.delete(
      `/developer/projects/${projectId}/worklogs/${worklogId}`
    );
  },

};