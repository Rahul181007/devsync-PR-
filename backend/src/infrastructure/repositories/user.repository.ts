import { IUserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { UserModel } from "../db/models/User.model";
import { IUserDocument } from "../db/models/User.model";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor(){
        super(UserModel)
    }
    private toDomain(doc: IUserDocument): User { //mapper
        return new User(
            doc._id.toString(),
            doc.companyId ? doc.companyId.toString() : null,
            doc.name,
            doc.email,
            doc.passwordHash,
            doc.role,
            doc.avatarUrl,
            doc.status,
            doc.settings,
            doc.createdAt,
            doc.updatedAt,
            doc.lastLoginAt
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await this.model.findOne({ email });
        return doc ? this.toDomain(doc) : null;
    }
    async findById(id: string): Promise<User | null> {
        const doc = await this.model.findById(id);
        return doc ? this.toDomain(doc) : null;
    }

    async create(data: Partial<User>): Promise<User> {
        const doc = await this.model.create(data);
        return this.toDomain(doc)
    }

    async assignCompany(userId: string, companyId: string): Promise<void> {
        await this.updateById(userId, { companyId })
    }

    async updatePassword(userId: string, passwordHash: string): Promise<void> {
        await this.updateById(userId, { passwordHash });
    }

    async updateLastLogin(userId: string, date: Date): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { lastLoginAt: date })
    }

    async updateStatus(userId: string, status: 'ACTIVE' | 'BLOCKED'): Promise<void> {
        await this.updateById(userId, { status })
    }

    
}