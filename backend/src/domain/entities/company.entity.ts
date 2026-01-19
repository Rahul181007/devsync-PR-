export type CompanyStatus='PENDING'|'APPROVED'|'REJECTED'|"SUSPENDED";
export type CompanyCreatedBy ='self'|'superadmin'
export type OnboardingStep= 'WORKSPACE'| 'BRANDING'| 'PROJECT'| 'DONE';

export class Company {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public status: CompanyStatus,
    public createdBy: CompanyCreatedBy,
    public onboardingStep: OnboardingStep,
    public ownerAdminId?: string,
    public domain?: string,
    public approvedBy?: string,
    public rejectionReason?: string,   
    public reviewedAt?: Date,  
    public logoUrl?: string,
    public themeColor?: string,
    public currentPlanId?: string,
    public subscriptionId?: string,
    public adminEmail?: string,
  ) {}
}



