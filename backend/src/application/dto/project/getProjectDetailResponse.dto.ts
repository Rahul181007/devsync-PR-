import { UserRole } from "../../../shared/utils/token.util";
import { ProjectStatus } from "./listProjectsResponse.dto"; // reuse union

export type ProjectMemberRole = "OWNER" | "DEVELOPER";

export interface ProjectMemberDTO {
  role: ProjectMemberRole;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;   
  };
}


export interface GetProjectDetailResponse {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  companyId: string;
  members: ProjectMemberDTO[];
}
