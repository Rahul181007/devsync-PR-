import { UpdateProfileDTO } from "../../dto/auth/updateProfile.dto";

export interface IUpdateProfileUseCase{
    execute(userId:string,data:UpdateProfileDTO):Promise<{message:string;name:string;avatarUrl:string|null}>
}