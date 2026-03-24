import { GetProfileResponseDTO } from "../../dto/auth/getProfile.dto";

export interface IGetProfileUseCase{
    execute(userId:string):Promise<GetProfileResponseDTO>
}