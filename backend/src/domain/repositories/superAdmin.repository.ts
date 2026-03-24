import { SuperAdmin } from "../entities/superAdmin.entity";

export interface ISuperAdminRepository {
    findByEmail(email:string):Promise<SuperAdmin|null>
    findById(id:string):Promise<SuperAdmin|null>
    updateLastLogin(id:string,date:Date):Promise<void>
    findActive(): Promise<SuperAdmin | null>;
    updatePassword(userId: string, passwordHash: string): Promise<void>;
    updateProfile(
  userId: string,
  data: { name?: string; avatarUrl?: string | null }
): Promise<{ name: string; avatarUrl: string | null }>;
}