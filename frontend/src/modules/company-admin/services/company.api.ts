import { http } from "../../../core/api/http";

export const companyApi={
    createWorkspace(data:{
        name:string;
        domain?:string
    }){
        return http.post('/company/workspace',data)
    },

    getMyCompany(){
        return http.get('/company/me')
    },
    updateBranding(data:FormData){
        return http.patch('/company/branding',data,{
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
        return http.post('/company/projects',data)
    }

}