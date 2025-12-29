import { IUserRepository } from "../../../domain/repositories/user.repository";
import { AppError } from "../../../shared/errors/AppError";

export class UnblockCompanyAdminUseCase{
    constructor(
        private userRepo:IUserRepository
    ){}

    async execute(targetUserId:string){
        const user=await this.userRepo.findById(targetUserId);
        if(!user){
            throw new AppError('user not found',404);
        }
        if(user.role!=='COMPANY_ADMIN'){
            throw new AppError('Target user is not a company admin', 400);
        }
        if(user.status==='ACTIVE'){
            throw new AppError('user is already active',400)
        }
        await this.userRepo.unBlockUser(targetUserId)
    }
}