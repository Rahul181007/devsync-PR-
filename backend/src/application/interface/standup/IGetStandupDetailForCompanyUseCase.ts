import { GetStandupDetailResponseDTO } from "../../dto/standup/getStandupDetailResponse.dto";

export interface IGetStandupDetailForCompanyUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        standupId:string
    ):Promise<GetStandupDetailResponseDTO>
}