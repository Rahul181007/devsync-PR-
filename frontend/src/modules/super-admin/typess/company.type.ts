export type CompanyStatus='APPROVED'|'PENDING'|'SUSPENDED';
export type AdminStatus='ACTIVE'|'BLOCKED'

export interface CompanyAdmin{
    id:string;
    email:string;
    status:AdminStatus
}
export interface Company{
    id:string;
    name:string;
    slug:string;
    status:CompanyStatus;
    domain?:string;
    ownerAdminId?:string
    admin?:CompanyAdmin
}