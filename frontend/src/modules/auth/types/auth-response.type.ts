import type { AuthRole } from "../auth.slice";

export interface LoginResponse {
    id: string;
    name?: string;
    email: string;
    role: AuthRole;
    companyId?: string;

    requiresOnboarding?: boolean;
    waitingForApproval?: boolean;
}