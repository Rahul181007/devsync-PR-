import { ProjectStatus } from "./listProjectsResponse.dto";

export interface CreateProjectResponse {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  companyId: string;
}