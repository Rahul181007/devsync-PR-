import { DeveloperListItem, IUserRepository } from "../../domain/repositories/user.repository";
import { User, UserStatus } from "../../domain/entities/user.entity";
import { UserModel } from "../db/models/User.model";
import { IUserDocument } from "../db/models/User.model";
import { BaseRepository } from "./base.repository";
import { UserMapper } from "../mappers/user/user.mapper";


export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor() {
        super(UserModel)
    }


    async findByEmail(email: string): Promise<User | null> {
        const doc = await this.model.findOne({ email });
        return doc ? UserMapper.toDomain(doc) : null;
    }
    async findById(id: string): Promise<User | null> {
        const doc = await this.model.findById(id);
        return doc ? UserMapper.toDomain(doc) : null;
    }

    async create(data: {
        companyId?: string | null;
        name: string;
        email: string;
        passwordHash?: string | null;
        role: "COMPANY_ADMIN" | "DEVELOPER";
        authProvider: "LOCAL" | "GOOGLE";
        avatarUrl?: string | null;
        status: UserStatus;
        otp?: string | null;
        otpExpiresAt?: Date | null;
        settings?: {
            theme?: string;
            notificationPreferences?: Record<string, unknown>;
        };
    }): Promise<User> {

        const doc = await this.model.create(UserMapper.toDocument({
            companyId: data.companyId ?? null,
            name: data.name,
            email: data.email,
            passwordHash: data.passwordHash ?? null,
            role: data.role,
            authProvider: data.authProvider,
            avatarUrl: data.avatarUrl ?? null,
            status: data.status,
            otp: data.otp ?? null,
            otpExpiresAt: data.otpExpiresAt ?? null,
            setting: data.settings ?? null, 
        }));

        return UserMapper.toDomain(doc);
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
    async findDevelopersByCompany(companyId: string, options: { page: number; limit: number; search?: string; status?: UserStatus; }): Promise<{ items: DeveloperListItem[]; total: number; }> {
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
        const [docs, total] = await Promise.all([
            this.model
                .find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }),
            this.model.countDocuments(filter)
        ]);
        const items: DeveloperListItem[] = docs.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            status: doc.status,
            role: doc.role
        }))

        return {
            items,
            total
        }
    }
    async updateOtp(userId: string, otp: string | null, otpExpiresAt: Date | null): Promise<void> {
        await this.updateById(userId, { otp, otpExpiresAt })
    }

    async findByIds(userIds: string[]): Promise<User[]> {
        const docs = await UserModel.find({
            _id: { $in: userIds }
        });

        return docs.map(doc => UserMapper.toDomain(doc));
    }
    async findCompanyAdminByCompany(companyId: string): Promise<User | null> {
        const doc = await this.model.findOne({
            companyId,
            role: "COMPANY_ADMIN",
            status: "ACTIVE"
        });

        return doc ? UserMapper.toDomain(doc) : null;
    }

    async updateProfile(
        userId: string,
        data: { name?: string; avatarUrl?: string | null }
    ): Promise<{ name: string; avatarUrl: string | null }> {

        const updated = await this.model.findByIdAndUpdate(
            userId,
            {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
            },
            { new: true }
        );

        if (!updated) {
            throw new Error("SuperAdmin not found");
        }

        return {
            name: updated.name,
            avatarUrl: updated.avatarUrl ?? null,
        };
    }

    async countDevelopers(companyId: string): Promise<number> {
        return await this.model.countDocuments({
            companyId,
            role: "DEVELOPER"
        });
    }

    async countByStatus(
        companyId: string,
        status: UserStatus
    ): Promise<number> {
        return await this.model.countDocuments({
            companyId,
            role: "DEVELOPER",
            status
        });
    }

    async countActiveDevelopers(companyId: string): Promise<number> {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

        return await this.model.countDocuments({
            companyId,
            role: "DEVELOPER",
            status: "ACTIVE",
            lastLoginAt: { $gte: last24Hours }
        });
    }
}