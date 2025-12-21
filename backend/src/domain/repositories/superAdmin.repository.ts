import { SuperAdmin } from "../entities/superAdmin.entity";
// import { IBaseRepository } from "./BaseRepository.repository";

export interface ISuperAdminRepository {
    findByEmail(email:string):Promise<SuperAdmin|null>
    findById(id:string):Promise<SuperAdmin|null>
    updateLastLogin(id:string,date:Date):Promise<void>
}