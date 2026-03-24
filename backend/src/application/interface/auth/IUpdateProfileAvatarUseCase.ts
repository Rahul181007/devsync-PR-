import { UpdateProfileAvatarResponseDTO } from "../../dto/auth/updateProfileAvatarResponse.dto";

export interface IUpdateProfileAvatarUseCase {
    execute(
        userId: string,
        file: {
            buffer: Buffer;
            mimetype: string;
            originalname: string;
        }
    ):Promise<UpdateProfileAvatarResponseDTO>
}