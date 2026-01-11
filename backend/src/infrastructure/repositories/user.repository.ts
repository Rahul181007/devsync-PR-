import { IUserRepository } from "../../domain/repositories/user.repository";
import { User, UserStatus } from "../../domain/entities/user.entity";
import { UserModel } from "../db/models/User.model";
import { IUserDocument } from "../db/models/User.model";
import { BaseRepository } from "./base.repository";


export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor() {
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

    async updateStatus(userId: string, status: UserStatus): Promise<void> {
        await this.updateById(userId, { status })
    }
    async findDevelopersByCompany(companyId: string, options: { page: number; limit: number; search?: string; status?: UserStatus; }): Promise<{ items: User[]; total: number; }> {
        const { page, limit, status, search } = options;
        const filter: Record<string, unknown> = {
            companyId,
            role: 'DEVELOPER'
        }
        if (status) {
            filter.status = status
        }
        if (search) {
            filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
        }
        const [items, total] = await Promise.all([
            this.model
                .find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            this.model.countDocuments(filter)
        ]);

        return {
            items: items.map(val => this.toDomain(val)),
            total
        }
    }




}