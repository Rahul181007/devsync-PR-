import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { AdminWorklogItem, ProjectTimesheetItem, ProjectWorklogItem } from "../types/wroklog.types";

export const adminWorklogApi = {
  getTaskWorklogs(projectId: string, taskId: string) {
    return http.get<{ data: AdminWorklogItem[] }>(
      API_ROUTES.COMPANY.TASK_WORKLOGS(projectId,taskId)
    );
  },

  getProjectWorklogs(projectId: string) {
  return http.get<{ data: ProjectWorklogItem[] }>(
    API_ROUTES.COMPANY.PROJECT_WORKLOGS(projectId)
  );
},
getProjectTimesheet(projectId: string) {
  return http.get<{ data: ProjectTimesheetItem[] }>(
    API_ROUTES.COMPANY.PROJECT_TIMESHEET(projectId)
  );
}
};