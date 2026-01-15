import type { AuthRole } from "../auth.slice";
export type OnboardingStep = 'WORKSPACE' | 'BRANDING' | 'PROJECT' | 'DONE';
export interface LoginResponse {
    id: string;
    name?: string;
    email: string;
    role: AuthRole;
    companyId?: string;
    companySlug?:string|null;

    requiresOnboarding?: boolean;
    waitingForApproval?: boolean;
    onboardingStep?: OnboardingStep;
}