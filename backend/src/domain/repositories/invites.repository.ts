import { Invite,UserRoles } from "../entities/invite.entity";
export interface InviteData{
    email:string;
    companyId:string;
    role:UserRoles;
    invitedBy:string;
    token:string,
    expiresAt:Date
}

export interface IInviteRepository{
    findPendingByEmail(email:string):Promise<Invite|null>;
    create(data:InviteData):Promise<Invite|null>
    findByToken(token:string):Promise<Invite|null>
    markAsAccepted(inviteId:string):Promise<void>
}