import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

interface InvolerContext {
    id:string;
    role:'COMPANY_ADMIN';
    companyId:string
}

export class ListDeveloperUsecase{
    constructor(
        private userRepo:IUserRepository
    ){}
    async execute(invoker:InvolerContext):Promise<User[]>{
        if(invoker.role!=='COMPANY_ADMIN'){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.FORBIDDEN,
                HttpStatus.FORBIDDEN
            )
        }
        if(!invoker.companyId){
            throw new AppError(
                RESPONSE_MESSAGES.COMPANY.NOT_FOUND,
                HttpStatus.BAD_REQUEST
            )
        }
        const developers=await this.userRepo.findDevelopersByCompany(invoker.companyId);
        return developers
    }
}