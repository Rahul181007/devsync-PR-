import { OnboardingStep } from "../../../domain/entities/company.entity";

export interface IGetAuthMeUseCase {
  execute(
    userId: string,
    role: string
  ): Promise<{
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      companyId?: string | null;
      companySlug?: string | null;
    };
    requiresOnboarding: boolean;
    waitingForApproval: boolean;
    rejectedCompany: boolean;
    rejectionReason: string | null;
    suspendedCompany: boolean;
    onboardingStep: OnboardingStep | null;
  }>;
}
