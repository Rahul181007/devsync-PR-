import { IPasswordResetRepository } from "../../domain/repositories/passwordReset.repository";
import { IPasswordResetDocument, PasswordResetModel } from "../db/models/passwordReset.model";
import { BaseRepository } from "./base.repository";

export class PasswordResetRepository extends BaseRepository<IPasswordResetDocument> implements IPasswordResetRepository{
    
    constructor(){
        super(PasswordResetModel)
    }

    async create(data: { email: string; otp: string; expiresAt: Date; }): Promise<IPasswordResetDocument> {
        return this.model.create(data)
    }
    async findValidOtp(email: string, otp: string): Promise<IPasswordResetDocument | null> {
        return this.model.findOne({
            email,
            otp,
            expiresAt:{$gt:new Date()}
        })
    }

    async deleteByEmail(email: string): Promise<void> {
        await this.model.deleteMany({email})
    }
}