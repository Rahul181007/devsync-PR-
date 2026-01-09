import { OnboardingStep } from "../../../domain/entities/company.entity";

export interface LoginResponseDTO{
    id:string;
    name:string;
    email:string;
    role:string;
    companyId?:string|null
    onboardingStep?:OnboardingStep,
    accessToken?:string;
    refreshToken?:string;

    requiresOnboarding?:boolean;
    waitingForApproval?:boolean;

}