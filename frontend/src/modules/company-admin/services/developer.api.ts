import { http } from "../../../core/api/http";
import type { Developer } from "../types/developer.types";

export interface FetchDevelopersParams{
      page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "BLOCKED";
}

export interface FetchDevelopersResponse {
  items: Developer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export const developerApiForCompany={
    getDevelopers(params:FetchDevelopersParams):Promise<FetchDevelopersResponse>{
       return http.get('/company/developers',{params}).then(res=>res.data.data);
    },
    inviteDeveloper(data:{email:string}){
     return http.post('/company/invite-developer',data)
    },
    blockDeveloper(userId:string){
        return http.post (`/company/developers/${userId}/block`)
    },
    unblockDeveloper(userId:string){
        return http.post(`/company/developers/${userId}/unblock`)
    }
}