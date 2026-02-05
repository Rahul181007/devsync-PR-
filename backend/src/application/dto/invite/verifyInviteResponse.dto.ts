import { UserRole } from "../../../shared/utils/token.util";

export interface VerifyInviteResponse {
  inviteId: string;
  email: string;
  role: UserRole;
  companyId: string;
}