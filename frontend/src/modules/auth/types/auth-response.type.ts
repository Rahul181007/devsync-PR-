import type { OnboardingStep, AuthRole } from "../auth.slice";

export interface LoginPayload {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  companyId?: string | null;
  companySlug?: string | null;
  requiresOnboarding?: boolean;
  waitingForApproval?: boolean;

  rejectedCompany?:boolean;
  rejectionReason?:string|null;

 suspendedCompany?:boolean

    onboardingStep?: OnboardingStep;
}
