import { ISuperAdminRepository } from "../../domain/repositories/superAdmin.repository";
import { SuperAdminModel,SuperAdminDocument } from "../db/models/superAdmin.model";
import { SuperAdmin } from "../../domain/entities/superAdmin.entity";
import { BaseRepository } from "./base.repository";

export type SuperAdminStatus = "ACTIVE" | "INACTIVE" ;


export class SuperAdminRepository extends BaseRepository<SuperAdminDocument> implements ISuperAdminRepository{
    constructor(){
        super(SuperAdminModel)
    }
    
    async findByEmail(email: string): Promise<SuperAdmin | null> {
        const doc= await this.model.findOne({email})
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
        await this.updateById(id,{lastLoginAt:date})
    }

    async findById(id: string): Promise<SuperAdmin | null> {
        const doc = await this.model.findById(id);
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