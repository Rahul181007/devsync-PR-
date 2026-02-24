import { CreateStandupRequestDTO } from "../../dto/standup/createStandupRequest.dto";

export interface ICreateStandupUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
        data:CreateStandupRequestDTO,
    ):Promise<void>
}