import { IUserRepository } from "../../../domain/repositories/user.repository";
import { AppError } from "../../../shared/errors/AppError";

export class BlockCompanyAdminUseCase{
    constructor(
        private userRepo:IUserRepository
    ){}

    async execute(targetUserId:string){
      const user=await this.userRepo.findById(targetUserId);
      if(!user){
        throw new AppError('user not found',404);
      }
      if(user.role!=='COMPANY_ADMIN'){
        throw new AppError('Only company admins can be blocked', 400);
      }
      if(user.status==='BLOCKED'){
        throw new AppError('user is already blocked',400)
      }
      await this.userRepo.blockUser(targetUserId)

    }
}