import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";
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
       return http.get(API_ROUTES.COMPANY.DEVELOPERS,{params}).then(res=>res.data.data);
    },
    inviteDeveloper(data:{email:string}){
     return http.post(API_ROUTES.COMPANY.INVITE_DEVELOPER,data)
    },
    blockDeveloper(userId:string){
        return http.post (API_ROUTES.COMPANY.BLOCK_DEVELOPER(userId))
    },
    unblockDeveloper(userId:string){
        return http.post(API_ROUTES.COMPANY.UNBLOCK_DEVELOPER(userId))
    }
}