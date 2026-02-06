import { UserRole } from "../../../shared/utils/token.util";


export interface CreateWorkspaceResponse {
  userId: string;
  companyId: string;
  role: UserRole;
}
