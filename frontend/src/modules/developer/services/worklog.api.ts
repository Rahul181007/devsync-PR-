import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
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
      API_ROUTES.DEVELOPER.TASK_WORKLOGS(projectId,taskId),
      data
    );
  },

  
  getWorklogsByTask(projectId: string, taskId: string) {
    return http.get<{ success: boolean; data: WorklogItem[] }>(
       API_ROUTES.DEVELOPER.GET_TASK_WORKLOGS(projectId,taskId)
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
      API_ROUTES.DEVELOPER.WORKLOG_BY_ID(projectId,worklogId),
      data
    );
  },

    deleteWorklog(projectId: string, worklogId: string) {
    return http.delete(
      API_ROUTES.DEVELOPER.WORKLOG_BY_ID(projectId,worklogId)
    );
  },

};