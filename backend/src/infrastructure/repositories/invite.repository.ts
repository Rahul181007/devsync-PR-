import { Invite } from "../../domain/entities/invite.entity";
import { IInviteRepository, InviteData } from "../../domain/repositories/invites.repository";
import { IInviteDocument, InviteModel } from "../db/models/Invite.model";

export class InviteRepository implements IInviteRepository{
    private toEntity(inviteDoc:IInviteDocument
        
    ):Invite{
        return new Invite(
            inviteDoc._id.toString(),
            inviteDoc.email,
            inviteDoc.companyId.toString(),
            inviteDoc.role,
            inviteDoc.token,
            inviteDoc.status,
            inviteDoc.expiresAt,
            inviteDoc.invitedBy.toString(),
            inviteDoc.createdAt
        )

    }

    async findPendingByEmail(email: string): Promise<Invite | null> {
        const inviteDOC=await InviteModel.findOne({
            email,
            status:'PENDING'
        })
        if(!inviteDOC){
            return null
        }
        return this.toEntity(inviteDOC)
    }
    async create(data: InviteData): Promise<Invite | null> {
        const inviteDoc=await InviteModel.create({
            email:data.email,
            companyId:data.companyId,
            role:data.role,
            token:data.token,
            expiresAt:data.expiresAt,
            invitedBy:data.invitedBy
        })
        return this.toEntity(inviteDoc)
    }
    async findByToken(token: string): Promise<Invite | null> {
        const inviteDoc=await InviteModel.findOne({token:token})
        if(!inviteDoc){
            return null
        }
        return this.toEntity(inviteDoc)
    }

    async markAsAccepted(inviteId: string): Promise<void> {
        await InviteModel.findByIdAndUpdate(inviteId,{status:'ACCEPTED'})
    }
}