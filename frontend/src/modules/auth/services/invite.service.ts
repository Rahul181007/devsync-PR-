import { http } from "../../../core/api/http";
import { API_ROUTES } from "../../../shared/constants/api.routes";

export interface AcceptInvitePayload{
    token:string;
    password:string;
    name:string;
}

export const inviteService={
    verifyInvite:(token:string)=>{
        return http.get(API_ROUTES.INVITE.VERIFY,{
            params:{token}
        })
    },

    acceptInvite:(data:AcceptInvitePayload)=>{
        return http.post(API_ROUTES.INVITE.ACCEPT,data)
    }
}