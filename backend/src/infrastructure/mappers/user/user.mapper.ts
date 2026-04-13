import { Types } from "mongoose";
import { User } from "../../../domain/entities/user.entity";
import { IUserDocument } from "../../db/models/User.model";

export class UserMapper {

  // ✅ DB → Domain
  static toDomain(doc: IUserDocument): User {
    return new User(
      doc._id.toString(),
      doc.companyId ? doc.companyId.toString() : null,
      doc.name,
      doc.email,
      doc.passwordHash ?? null,
      doc.role,
      doc.avatarUrl ?? null,
      doc.status,
      doc.authProvider,
      doc.otp ?? null,
      doc.otpExpiresAt ?? null,
      doc.settings ?? null,
      doc.createdAt,
      doc.updatedAt,
      doc.lastLoginAt ?? null
    );
  }

  // ✅ Input/Domain → DB
  static toDocument(data: Partial<User>) {
    return {
      companyId:
        data.companyId !== undefined
          ? data.companyId
            ? new Types.ObjectId(data.companyId)
            : null
          : undefined,

      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash ?? undefined,
      role: data.role,
      authProvider: data.authProvider,
      avatarUrl: data.avatarUrl ?? null,
      status: data.status,

      otp: data.otp ?? null,
      otpExpiresAt: data.otpExpiresAt ?? null,

      settings: data.setting ?? undefined, // ⚠️ your entity uses "setting"

      lastLoginAt: data.lastLoginAt ?? undefined,
    };
  }
}