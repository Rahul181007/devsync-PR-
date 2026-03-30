import { http } from "../../../core/api/http";
import type { AdminWorklogItem, ProjectTimesheetItem, ProjectWorklogItem } from "../types/wroklog.types";

export const adminWorklogApi = {
  getTaskWorklogs(projectId: string, taskId: string) {
    return http.get<{ data: AdminWorklogItem[] }>(
      `/projects/${projectId}/tasks/${taskId}/worklogs`
    );
  },

  getProjectWorklogs(projectId: string) {
  return http.get<{ data: ProjectWorklogItem[] }>(
    `/company/projects/${projectId}/worklogs`
  );
},
getProjectTimesheet(projectId: string) {
  return http.get<{ data: ProjectTimesheetItem[] }>(
    `/company/projects/${projectId}/timesheet`
  );
}
};