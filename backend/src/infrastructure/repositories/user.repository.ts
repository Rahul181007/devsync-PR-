import { IUserRepository } from "../../domain/repositories/user.repository";
import { User, UserStatus } from "../../domain/entities/user.entity";
import { UserModel } from "../db/models/User.model";
import { IUserDocument } from "../db/models/User.model";
import { BaseRepository } from "./base.repository";


export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor() {
        super(UserModel)
    }
    private _toDomain(doc: IUserDocument): User { //mapper
        return new User(
            doc._id.toString(),
            doc.companyId ? doc.companyId.toString() : null,
            doc.name,
            doc.email,
            doc.passwordHash,
            doc.role,
            doc.avatarUrl,
            doc.status,
            doc.authProvider,
            doc.otp,
            doc.otpExpiresAt,
            doc.settings,
            doc.createdAt,
            doc.updatedAt,
            doc.lastLoginAt
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const doc = await this.model.findOne({ email });
        return doc ? this._toDomain(doc) : null;
    }
    async findById(id: string): Promise<User | null> {
        const doc = await this.model.findById(id);
        return doc ? this._toDomain(doc) : null;
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

        const doc = await this.model.create({
            companyId: data.companyId ?? null,
            name: data.name,
            email: data.email,
            passwordHash: data.passwordHash ?? undefined, // ✅ FIX
            role: data.role,
            authProvider: data.authProvider,
            avatarUrl: data.avatarUrl ?? null,
            status: data.status,
            otp: data.otp ?? null,
            otpExpiresAt: data.otpExpiresAt ?? null,
            settings: data.settings ?? {},
        });

        return this._toDomain(doc);
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
            items: items.map(val => this._toDomain(val)),
            total
        }
    }
   async updateOtp(userId: string, otp: string | null, otpExpiresAt: Date | null): Promise<void> {
       await this.updateById(userId,{otp,otpExpiresAt})
   }



}