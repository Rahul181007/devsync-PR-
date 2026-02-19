import { GetMyCurrentSprintStandupsResponseDTO } from "../../dto/standup/getMyCurrentSprintStandupsResponse.dto";

export interface IGetMyCurrentSprintStandupsUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string,
    ):Promise<GetMyCurrentSprintStandupsResponseDTO>
}