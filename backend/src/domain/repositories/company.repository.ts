
import { Company, CompanyStatus } from "../entities/company.entity";

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
    ownerAdminId:string;
    createdBy:'superadmin';
    approvedBy:string;
    status:'APPROVED'
}
export interface ICompanyRepository{
    findByName(name:string):Promise<Company|null>
    findByDomain(domain:string): Promise<Company|null>
    create(data:CreateCompanyData):Promise<Company>
    
    findAll(query:ListCompaniesQuery):Promise<{items:Company[],total:number}>
    
    updateStatus(companyId:string,status:CompanyStatus,approvedBy?:string):Promise<void>

    findById(companyId:string):Promise<Company|null>
}