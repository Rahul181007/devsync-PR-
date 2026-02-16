import { GetSprintDetailResponseDTO } from "../../dto/sprint/getSprintDetailResponse.dto";

export interface IGetSprintDetailUseCase{
    execute(userId:string,companyId:string,projectId:string,sprintId:string):Promise<GetSprintDetailResponseDTO>
}