import { http } from "../../../core/api/http";

export const userService={
    blockCompanyAdmin:(userId:string)=>{
        return http.post(`/superadmin/users/${userId}/block`);
    },
    unblockCompanyAdmin:(userId:string)=>{
        return http.post(`/superadmin/users/${userId}/unblock`)
    }

}