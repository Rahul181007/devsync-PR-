import { Types } from "mongoose";
import { InviteData } from "../../../domain/repositories/invites.repository";
import { Invite } from "../../../domain/entities/invite.entity";
import { IInviteDocument } from "../../db/models/Invite.model";

export class InviteMapper {

  // ✅ DB → Domain
  static toDomain(doc: IInviteDocument): Invite {
    return new Invite(
      doc._id.toString(),
      doc.email,
      doc.companyId.toString(),
      doc.role,
      doc.token,
      doc.status,
      doc.expiresAt,
      doc.invitedBy.toString(),
      doc.createdAt
    );
  }

  // ✅ Input → DB
  static toDocument(data: InviteData | Partial<Invite>) {
    return {
      email: data.email,
      companyId: new Types.ObjectId(data.companyId),
      role: data.role,
      token: data.token,
      status: "status" in data ? data.status : "PENDING",
      expiresAt: data.expiresAt,
      invitedBy: new Types.ObjectId(data.invitedBy),
    };
  }
}