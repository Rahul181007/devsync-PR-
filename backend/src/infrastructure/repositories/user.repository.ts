import { IUserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/use.entity";
import { UserModel } from "../db/models/User.model";


export class UserRepository implements IUserRepository{
    private toDomain(doc:any):User{
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
        const doc=await UserModel.findOne({email});
        return doc? this.toDomain(doc):null;
    }
    async findById(id: string): Promise<User | null> {
        const doc=await UserModel.findById(id);
        return doc?this.toDomain(doc):null;
    }

    async create(data: Partial<User>): Promise<User | null> {
        const doc =await UserModel.create(data);
        return this.toDomain(doc)
    }

    async updatePassword(userId: string, passwordHash: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId,{passwordHash});
    }

    async updateLastLogin(userId: string, date: Date): Promise<void> {
        await UserModel.findByIdAndUpdate(userId,{lastLoginAt:date})
    }

    async updateStatus(userId: string, status: "ACTIVE" | "INACTIVE" | "SUSPENDED"): Promise<void> {
        await UserModel.findByIdAndUpdate(userId,{status})
    }
}