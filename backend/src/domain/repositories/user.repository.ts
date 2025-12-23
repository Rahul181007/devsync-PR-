import { User } from "../entities/use.entity";


export interface IUserRepository {
    findByEmail(email:string):Promise<User|null>;

    create(data:Partial<User>):Promise <User|null>;
    
    findById(id:string):Promise<User|null>;
    
    assignCompany(userId:string,companyId:string):Promise<void>;

    updatePassword(userId:string,passwordHash:string):Promise<void>;

    updateLastLogin(userId:string,date:Date):Promise<void>;

    updateStatus(
        userId:string,
        status:"ACTIVE" | "INACTIVE" | "SUSPENDED"
    ):Promise<void>
}