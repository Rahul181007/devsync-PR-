import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { BlockDeveloperContext } from "../../dto/user/blockDeveloperContext.dto";
import { IBlockDeveloperUseCase } from "../../interface/user/IBlockDeveloperUseCase";



export class BlockDeveloperUseCase implements IBlockDeveloperUseCase{
    constructor(
        private _userRepo:IUserRepository
    ){}

    async execute(developerId:string,invoker:BlockDeveloperContext):Promise<void>{
        if(invoker.role!=='COMPANY_ADMIN'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN,HttpStatus.FORBIDDEN)
        }

        const developer=await this._userRepo.findById(developerId);
        if(!developer){
            throw new AppError(RESPONSE_MESSAGES.USER.NOT_FOUND,HttpStatus.FORBIDDEN)
        }

        if(developer.role!=='DEVELOPER'){
            throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN,HttpStatus.FORBIDDEN)
        }

        if(developer.companyId!==invoker.companyId){
            throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN,HttpStatus.FORBIDDEN)
        }
        await this._userRepo.updateStatus(developerId,'BLOCKED')
    }
}