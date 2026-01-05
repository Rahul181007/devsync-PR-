import { UserStatus } from "../../../domain/entities/user.entity";

export interface ListDevelopersDTO{
    companyId:string;
    page:number;
    limit:number;
    search?:string;
    status?:UserStatus
}