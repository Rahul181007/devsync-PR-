import { updateStandupRequestDTO } from "../../dto/standup/updateStandupRequest.dto";

export interface IUpdateStandupUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        data:updateStandupRequestDTO
    ):Promise<void>
}