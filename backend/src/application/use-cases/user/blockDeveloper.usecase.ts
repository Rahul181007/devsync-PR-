import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

interface InvokerContext {
    id:string;
    role:'COMPANY_ADMIN';
    companyId:string;
}

export class BlockDeveloperUseCase{
    constructor(
        private userRepo:IUserRepository
    ){}

    async execute(developerId:string,invoker:InvokerContext):Promise<void>{
        if(invoker.role!=='COMPANY_ADMIN'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN,HttpStatus.FORBIDDEN)
        }

        const developer=await this.userRepo.findById(developerId);
        if(!developer){
            throw new AppError(RESPONSE_MESSAGES.USER.NOT_FOUND,HttpStatus.FORBIDDEN)
        }

        if(developer.role!=='DEVELOPER'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN,HttpStatus.FORBIDDEN)
        }

        if(developer.companyId!==invoker.companyId){
            throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN,HttpStatus.FORBIDDEN)
        }
        await this.userRepo.updateStatus(developerId,'BLOCKED')
    }
}