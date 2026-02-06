import { http } from "../../../core/api/http";
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
      "/company/projects", 
      { params }
    );
  },

  getProjectDetail(projectId: string) {
    return http.get<{ message: string; data: ProjectDetail }>(
      `/company/projects/${projectId}` 
    );
  },
};
