import { ProjectStatus } from "./listProjectsResponse.dto";

export interface UpdateProjectResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
}