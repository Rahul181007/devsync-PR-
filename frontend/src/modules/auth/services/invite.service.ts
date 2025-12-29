import { http } from "../../../core/api/http";

export interface AcceptInvitePayload{
    token:string;
    password:string;
}

export const inviteService={
    verifyInvite:(token:string)=>{
        return http.get('/invite/verify',{
            params:{token}
        })
    },

    acceptInvite:(data:AcceptInvitePayload)=>{
        return http.post('/invite/accept',data)
    }
}