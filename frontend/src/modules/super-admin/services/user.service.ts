import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";

export const userService={
    blockCompanyAdmin:(userId:string)=>{
        return http.post(API_ROUTES.SUPER_ADMIN.BLOCK_USER(userId));
    },
    unblockCompanyAdmin:(userId:string)=>{
        return http.post(API_ROUTES.SUPER_ADMIN.UNBLOCK_USER(userId))
    }

}