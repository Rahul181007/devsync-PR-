import { ISuperAdminRepository } from "../../../domain/repositories/superAdmin.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IFileStorage } from "../../../domain/service/fileStorage.service";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { UpdateProfileAvatarResponseDTO } from "../../dto/auth/updateProfileAvatarResponse.dto";
import { IUpdateProfileAvatarUseCase } from "../../interface/auth/IUpdateProfileAvatarUseCase";

export class UpdateProfileAvatarUseCase implements IUpdateProfileAvatarUseCase{
    constructor(
        private _userRepo:IUserRepository,
        private _superAdminRepo:ISuperAdminRepository,
        private _fileStorage:IFileStorage
    ){}

    async execute(userId: string, file: { buffer: Buffer; mimetype: string; originalname: string; }): Promise<UpdateProfileAvatarResponseDTO> {
        const fileUrl=await this._fileStorage.upload({
            file:file.buffer,
            folder:"avatars",
            contentType:file.mimetype
        })

        const user=await this._userRepo.findById(userId);

        if(user){
            const updated=await this._userRepo.updateProfile(userId,{
                avatarUrl:fileUrl
            })

            return {
                message:RESPONSE_MESSAGES.USER.PROFILE_UPDATED,
                name:updated.name,
                avatarUrl:updated.avatarUrl
            }
        }

        const superAdmin=await this._superAdminRepo.findById(userId);

        if(!superAdmin){
            throw new AppError(
                RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND,
                HttpStatus.NOT_FOUND
            )
        }

        const updated=await this._superAdminRepo.updateProfile(userId,{
            avatarUrl:fileUrl
        });

        return {           
                message:RESPONSE_MESSAGES.USER.PROFILE_UPDATED,
                name:updated.name,
                avatarUrl:updated.avatarUrl            
        }
    }
}