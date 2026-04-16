import { Invite } from "../../domain/entities/invite.entity";
import { IInviteRepository, InviteData } from "../../domain/repositories/invites.repository";
import { IInviteDocument, InviteModel } from "../db/models/Invite.model";
import { InviteMapper } from "../mappers/invite/invite.mapper";
import { BaseRepository } from "./base.repository";

export class InviteRepository extends BaseRepository<IInviteDocument> implements IInviteRepository {
    
    constructor(){
        super(InviteModel)
    }

    async findPendingByEmail(email: string): Promise<Invite | null> {
        const inviteDOC = await this.model.findOne({
            email,
            status: 'PENDING'
        })
        if (!inviteDOC) {
            return null
        }
        return InviteMapper.toDomain(inviteDOC)
    }
    async create(data: InviteData): Promise<Invite> { //remove null
        const inviteDoc = await this.model.create(InviteMapper.toDocument(data))
        return InviteMapper.toDomain(inviteDoc)
    }
    async findByToken(token: string): Promise<Invite | null> {
        const inviteDoc = await this.model.findOne({ token: token })
        if (!inviteDoc) {
            return null
        }
        return InviteMapper.toDomain(inviteDoc)
    }

    async markAsAccepted(inviteId: string): Promise<void> {
        await this.updateById(inviteId, { status: 'ACCEPTED' })
    }

    async updateInvite(InviteId: string, token: string, expiresAt: Date): Promise<Invite | null> {
        const inviteDoc = await this.updateById(
            InviteId,
            { token, expiresAt }
           
        )

        return inviteDoc ? InviteMapper.toDomain(inviteDoc) : null
    }

    async findPendingByEmailAndCompany(email: string, companyId: string): Promise<Invite | null> {
        const invite = await this.model.findOne({
            email,
            companyId,
            status: 'PENDING'
        })
        return invite ? InviteMapper.toDomain(invite) : null
    }
    async hasPendingInviteForCompany(companyId: string): Promise<boolean> {
    return this.exists({
      companyId,
      status: "PENDING"
    });

    }
}