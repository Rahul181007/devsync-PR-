import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";

export class UnblockCompanyAdminUseCase{
    constructor(
        private userRepo:IUserRepository
    ){}

    async execute(targetUserId:string){
        const user=await this.userRepo.findById(targetUserId);
        if(!user){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND);
        }
        if(user.role!=='COMPANY_ADMIN'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.TARGET_NOT_COMPANY_ADMIN,HttpStatus.BAD_REQUEST);
        }
        if(user.status==='ACTIVE'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ALREADY_ACTIVE,HttpStatus.BAD_REQUEST)
        }
        await this.userRepo.updateStatus(targetUserId,'ACTIVE')
    }
}