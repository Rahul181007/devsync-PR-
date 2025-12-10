import { SuperAdmin } from "../entities/superAdmin.entity";

export interface ISuperAdminRepository{
    findByEmail(email:string):Promise<SuperAdmin|null>
    updateLastLogin(id:string,date:Date):Promise<void>
}