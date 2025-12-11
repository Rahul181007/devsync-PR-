import { ISuperAdminRepository } from "../../domain/repositories/superAdmin.repository";
import { SuperAdminModel } from "../db/models/superAdmin.model";
import { SuperAdmin } from "../../domain/entities/superAdmin.entity";

export type SuperAdminStatus = "ACTIVE" | "INACTIVE" ;


export class SuperAdminRepository implements ISuperAdminRepository{
    
    async findByEmail(email: string): Promise<SuperAdmin | null> {
        const doc= await SuperAdminModel.findOne({email})
        if(!doc) return null
        return new SuperAdmin(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.passwordHash,
            'SUPER_ADMIN',
            doc.avatarUrl ?? null,
            doc.status as SuperAdminStatus,
            doc.createdAt,
            doc.updatedAt,
            doc.lastLoginAt??null
        )
    }

    async updateLastLogin(id: string, date: Date): Promise<void> {
        await SuperAdminModel.findByIdAndUpdate(id,{lastLoginAt:date})
    }

    async findById(id: string): Promise<SuperAdmin | null> {
        const doc = await SuperAdminModel.findById(id);
        if(!doc) return null
        return new SuperAdmin(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.passwordHash,
            'SUPER_ADMIN',
            doc.avatarUrl ?? null,
            doc.status as SuperAdminStatus,
            doc.createdAt,
            doc.updatedAt,
            doc.lastLoginAt??null
        )        
    }
}