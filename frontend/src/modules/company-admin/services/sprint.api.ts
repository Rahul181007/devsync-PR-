import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { PlanSprintRequest, SprintDetail, SprintListItems } from "../types/sprint.types";
import type { TaskListItem } from "../types/task.types";

export const sprintApi = {
  createSprint(projectId: string, data: {
    name: string;
    goal?: string | null;
    startDate: string;
    endDate: string
  }) {
    return http.post<{ success: boolean; data: SprintDetail }>(
      API_ROUTES.COMPANY.SPRINTS(projectId), data
    )
  },

  getProjectSprints(projectId: string) {
    return http.get<{ success: boolean; data: SprintListItems[] }>(
      API_ROUTES.COMPANY.SPRINTS(projectId)
    )
  },

  getSprintDetail(projectId: string, sprintId: string) {
    return http.get<{
      success: boolean; data: {
        sprint: SprintDetail;
        tasks: TaskListItem[]
      }
    }>(API_ROUTES.COMPANY.SPRINT_BY_ID(projectId, sprintId))
  },

  activateSprint(projectId: string, sprintId: string) {
    return http.patch<{ success: boolean; message: string }>(
      API_ROUTES.COMPANY.ACTIVATE_SPRINT(projectId, sprintId)
    );
  },


  completeSprint(projectId: string, sprintId: string) {
    return http.patch<{ success: boolean; message: string }>(
      API_ROUTES.COMPANY.COMPLETE_SPRINT(projectId,sprintId)
    );
  },


  planSprintTasks(projectId: string, data: PlanSprintRequest) {
    return http.patch<{ success: boolean; message: string }>(
      API_ROUTES.COMPANY.PLAN_SPRINT(projectId),
      data
    );
  }

}