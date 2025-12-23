import { Company } from "../entities/company.entity";

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
}