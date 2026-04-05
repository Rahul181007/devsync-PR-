import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";

export const companyApi={
    createWorkspace(data:{
        name:string;
        domain?:string
    }){
        return http.post(API_ROUTES.COMPANY.WORKSPACE,data)
    },

    getMyCompany(){
        return http.get(API_ROUTES.COMPANY.ME)
    },
    updateBranding(data:FormData){
        return http.patch(API_ROUTES.COMPANY.BRANDING,data,{
            headers:{
                'Content-Type':"multipart/form-data"
            }
        })
    },

    createProject(data:{
        name:string;
        description?:string;
        startDate?:string;
        endDate?:string
    }){
        return http.post('/company/projects/first',data)
    }

}