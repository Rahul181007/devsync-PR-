import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
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
        return http.get<{success:boolean,data:GetCompaniesResponse}>(API_ROUTES.SUPER_ADMIN.COMPANIES,{params})
    },
    getCompanyById:(companyId:string)=>{
       return http.get(API_ROUTES.SUPER_ADMIN.COMPANY_BY_ID(companyId))
    },
    inviteCompanyAdmin:(companyId:string,email:string)=>{
        return http.post(API_ROUTES.SUPER_ADMIN.INVITE_COMPANY_ADMIN(companyId),{email,role:'COMPANY_ADMIN'})
    },
    approveCompany:(companyId:string)=>{
        return http.patch(API_ROUTES.SUPER_ADMIN.APPROVE_COMPANY(companyId))
    },
    createCompany:(data:{name:string;domain?:string;adminEmail:string})=>{
        return http.post(API_ROUTES.SUPER_ADMIN.COMPANIES,data)
    },
    suspendCompany:(companyId:string)=>{
        return http.patch(API_ROUTES.SUPER_ADMIN.SUSPEND_COMPANY(companyId))
    },

    unsuspendCompany:(companyId:string)=>{
      return http.patch(API_ROUTES.SUPER_ADMIN.UNSUSPEND_COMPANY(companyId))
    },
    rejectCompany(companyId:string,reason:string){
        return http.post(API_ROUTES.SUPER_ADMIN.REJECT_COMPANY(companyId),{reason})
    }

}