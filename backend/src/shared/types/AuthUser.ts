export type AuthRole='SUPER_ADMIN'|'COMPANY_ADMIN'|'DEVELOPER'
export interface RequestUser{
    id:string;
    role:AuthRole;
    companyId?:string|null
}