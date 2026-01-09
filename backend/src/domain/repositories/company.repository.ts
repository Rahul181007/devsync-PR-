
import { Company, CompanyStatus,CompanyCreatedBy, OnboardingStep } from "../entities/company.entity";

export interface ListCompaniesQuery{
    page:number;
    limit:number;
    status?:CompanyStatus;
    search?:string;
}
export interface CreateCompanyData{
    name:string;
    slug:string;
    domain?:string;
    createdBy:CompanyCreatedBy;
    approvedBy?:string;
    status:CompanyStatus;
    adminEmail?:string|null;
    onboardingStep: OnboardingStep;
     ownerAdminId?: string;
}
export interface ICompanyRepository{
    findByName(name:string):Promise<Company|null>
    findByDomain(domain:string): Promise<Company|null>
    create(data:CreateCompanyData):Promise<Company>
    
    findAll(query:ListCompaniesQuery):Promise<{items:Company[],total:number}>
    
    updateStatus(companyId:string,status:CompanyStatus,approvedBy?:string):Promise<void>

    findById(companyId:string):Promise<Company|null>

    assignOwnerAdmin(companyId:string,userId:string):Promise<void>

    findByEmail(email:string):Promise<Company|null>

    updateBranding(companyId:string,data:{logoUrl?:string,themeColor?:string}):Promise<void>

    updateOnboardingStep(companyId:string,step:OnboardingStep):Promise<void>
}