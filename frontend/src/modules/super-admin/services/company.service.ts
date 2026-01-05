import { http } from "../../../core/api/http";
import type { GetCompaniesResponse } from "../typess/company.api";
import type { CompanyStatus } from "../typess/company.type";

export interface GetCompaniesParams{
    page?:number;
    limit?:number;
    search?:string;
    status?:CompanyStatus;
}
export const companyService={
    getCompanies:(params:GetCompaniesParams)=>{
        return http.get<{success:boolean,data:GetCompaniesResponse}>('/superadmin/companies',{params})
    },
    getCompanyById:(companyId:string)=>{
       return http.get(`/superadmin/companies/${companyId}`)
    },
    inviteCompanyAdmin:(companyId:string,email:string)=>{
        return http.post(`/superadmin/companies/${companyId}/invite`,{email,role:'COMPANY_ADMIN'})
    },
    approveCompany:(companyId:string)=>{
        return http.patch(`/superadmin/companies/${companyId}/approve`)
    },
    createCompany:(data:{name:string;domain?:string;adminEmail:string})=>{
        return http.post('/superadmin/companies',data)
    },
    suspendCompany:(companyId:string)=>{
        return http.patch(`/superadmin/companies/${companyId}/suspend`)
    }
}