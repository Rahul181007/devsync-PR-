export type CompanyStatus='PENDING'|'APPROVED'|"SUSPENDED";
export type CompanyCreatedBy ='self'|'superadmin'

export class Company {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public status: CompanyStatus,
    public createdBy: CompanyCreatedBy,
    public ownerAdminId?: string,
    public domain?: string,
    public approvedBy?: string,
    public themeColor?: string,
    public currentPlanId?: string,
    public subscriptionId?: string
  ) {}
}
