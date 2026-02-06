import { UserRole } from "../../../shared/utils/token.util";

export type InviteRedirectTarget = "ONBOARDING" | "DASHBOARD";

export interface AcceptInviteResponse {
  userId: string;
  companyId: string;
  role: UserRole;
  redirectTo: InviteRedirectTarget;
}