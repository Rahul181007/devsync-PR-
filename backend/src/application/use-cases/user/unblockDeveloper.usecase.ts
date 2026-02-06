import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { Role } from "../../../shared/constants/roleenum";
import { AppError } from "../../../shared/errors/AppError";
import { BlockDeveloperContext } from "../../dto/user/blockDeveloperContext.dto";
import { IUnblockDeveloperUseCase } from "../../interface/user/IUnblockDeveloperUseCase";



export class UnblockDeveloperUseCase implements IUnblockDeveloperUseCase{
    constructor(
        private _userRepo:IUserRepository
    ){}

    async execute(developerId:string,invoker:BlockDeveloperContext){
            if (invoker.role !== Role.COMPANY_ADMIN) {
      throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    const developer = await this._userRepo.findById(developerId);
    if (!developer) {
      throw new AppError(RESPONSE_MESSAGES.USER.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (developer.role !== Role.DEVELOPER) {
      throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN, HttpStatus.FORBIDDEN);
    }

    if (developer.companyId !== invoker.companyId) {
      throw new AppError(RESPONSE_MESSAGES.AUTH.FORBIDDEN, HttpStatus.FORBIDDEN);
    }
    await this._userRepo.updateStatus(developerId,'ACTIVE')
    }
}