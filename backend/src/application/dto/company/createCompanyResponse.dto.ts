export interface CreateCompanyResponse {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  status: string;
  onboardingStep: string;
  adminEmail?: string | null;
}
