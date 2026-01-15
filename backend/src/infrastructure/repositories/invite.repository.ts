import { Invite } from "../../domain/entities/invite.entity";
import { IInviteRepository, InviteData } from "../../domain/repositories/invites.repository";
import { IInviteDocument, InviteModel } from "../db/models/Invite.model";
import { BaseRepository } from "./base.repository";

export class InviteRepository extends BaseRepository<IInviteDocument> implements IInviteRepository {
    
    constructor(){
        super(InviteModel)
    }

    private _toEntity(inviteDoc: IInviteDocument

    ): Invite {
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
        const inviteDOC = await this.model.findOne({
            email,
            status: 'PENDING'
        })
        if (!inviteDOC) {
            return null
        }
        return this._toEntity(inviteDOC)
    }
    async create(data: InviteData): Promise<Invite> { //remove null
        const inviteDoc = await this.model.create({
            email: data.email,
            companyId: data.companyId,
            role: data.role,
            token: data.token,
            expiresAt: data.expiresAt,
            invitedBy: data.invitedBy
        })
        return this._toEntity(inviteDoc)
    }
    async findByToken(token: string): Promise<Invite | null> {
        const inviteDoc = await this.model.findOne({ token: token })
        if (!inviteDoc) {
            return null
        }
        return this._toEntity(inviteDoc)
    }

    async markAsAccepted(inviteId: string): Promise<void> {
        await this.updateById(inviteId, { status: 'ACCEPTED' })
    }

    async updateInvite(InviteId: string, token: string, expiresAt: Date): Promise<Invite | null> {
        const inviteDoc = await this.updateById(
            InviteId,
            { token, expiresAt }
           
        )

        return inviteDoc ? this._toEntity(inviteDoc) : null
    }

    async findPendingByEmailAndCompany(email: string, companyId: string): Promise<Invite | null> {
        const invite = await this.model.findOne({
            email,
            companyId,
            status: 'PENDING'
        })
        return invite ? this._toEntity(invite) : null
    }
    async hasPendingInviteForCompany(companyId: string): Promise<boolean> {
    return this.exists({
      companyId,
      status: "PENDING"
    });

    }
}