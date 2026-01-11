import { User } from "../entities/user.entity";
import { UserStatus } from "../entities/user.entity";

export interface IUserRepository {
    findByEmail(email:string):Promise<User|null>;

    create(data:Partial<User>):Promise <User|null>;
    
    findById(id:string):Promise<User|null>;
    
    assignCompany(userId:string,companyId:string):Promise<void>;

    updatePassword(userId:string,passwordHash:string):Promise<void>;

    updateLastLogin(userId:string,date:Date):Promise<void>;

    updateStatus(
        userId:string,
        status:UserStatus
    ):Promise<void>

    findDevelopersByCompany(companyId:string,options:{
        page:number;
        limit:number;
        search?:string;
        status?:UserStatus
    }):Promise<{items:User[];total:number}>
}