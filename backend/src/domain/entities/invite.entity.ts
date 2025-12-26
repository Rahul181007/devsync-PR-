export type UserRoles='COMPANY_ADMIN'|'DEVELOPER';
export type InviteStatus="PENDING" | "ACCEPTED" | "EXPIRED";
export class Invite{
    constructor(
        public readonly id:string,
        public email:string,
        public companyId:string,
        public role:UserRoles,
        public token:string,
        public status:InviteStatus,
        public expiresAt:Date,
        public invitedBy:string,
        public createdAt:Date
    ){}
}