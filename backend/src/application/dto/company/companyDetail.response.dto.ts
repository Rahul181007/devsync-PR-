export interface CompanyAdminDTO{
    id:string;
    email:string;
    status:'ACTIVE'|'BLOCKED'
}

export interface CompanyDetailResponseDTO{
    id:string;
    name:string;
    domain?:string;
    status:'PENDING'|'APPROVED'|'SUSPENDED';
    ownerAdminId?:string;
    admin?:CompanyAdminDTO
}