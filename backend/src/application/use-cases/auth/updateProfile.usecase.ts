import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateProfileDTO } from "../../dto/auth/updateProfile.dto";
import { IUpdateProfileUseCase } from "../../interface/auth/IUpdateProfileUseCase";

export class UpdateProfileUseCase implements IUpdateProfileUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _superAdminRepo:ISuperAdminRepository
    ){}

    async execute(userId: string, data: UpdateProfileDTO): Promise<{ message: string; name: string; avatarUrl: string | null; }> {
        const user=await this._userRepo.findById(userId);
        if(user){
            const updated=await this._userRepo.updateProfile(userId,data);
            return {
                message:RESPONSE_MESSAGES.USER.PROFILE_UPDATED,
                name:updated.name,
                avatarUrl:updated.avatarUrl
            }
        }

        const superAdmin=await this._superAdminRepo.findById(userId);
        if(!superAdmin){
            throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,HttpStatus.NOT_FOUND)
        }

        const updated=await this._superAdminRepo.updateProfile(userId,data)

        return {
            message:RESPONSE_MESSAGES.USER.PROFILE_UPDATED,
            name:updated.name,
            avatarUrl:updated.avatarUrl
        }
    }
}