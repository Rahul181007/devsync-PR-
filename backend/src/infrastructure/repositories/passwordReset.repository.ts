import { IPasswordResetRepository } from "../../domain/repositories/passwordReset.repository";
import { IPasswordResetDocument, PasswordResetModel } from "../db/models/passwordReset.model";

export class PasswordResetRepository implements IPasswordResetRepository{
    async create(data: { email: string; otp: string; expiresAt: Date; }): Promise<IPasswordResetDocument> {
        return PasswordResetModel.create(data)
    }
    async findValidOtp(email: string, otp: string): Promise<IPasswordResetDocument | null> {
        return PasswordResetModel.findOne({
            email,
            otp,
            expiresAt:{$gt:new Date()}
        })
    }

    async deleteByEmail(email: string): Promise<void> {
        await PasswordResetModel.deleteMany({email})
    }
}