import { http } from "../../../core/api/http";

export const projectApi={
    createProject(data:{
        name:string;
        description?:string;
        startDate?:string;
        endDate?:string;
    }){
        return http.post("/company/projects",data)
    }
}