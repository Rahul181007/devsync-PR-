import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
import type { ProjectDetail, ProjectListData } from "../types/project.types";

interface GetProjectParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "ARCHIVED" | "COMPLETED";
}

export const projectApi = {
  getProjects(params: GetProjectParams) {
    return http.get<ProjectListData>(
      API_ROUTES.DEVELOPER.PROJECTS, 
      { params }
    );
  },

  getProjectDetail(projectId: string) {
    return http.get<{ message: string; data: ProjectDetail }>(
      API_ROUTES.DEVELOPER.PROJECT_BY_ID(projectId) 
    );
  },
};
