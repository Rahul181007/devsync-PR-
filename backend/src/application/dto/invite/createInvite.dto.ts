import { UserRoles } from "../../../domain/entities/invite.entity";
export interface CreateInviteInput{
    email:string;
    role:UserRoles;
}