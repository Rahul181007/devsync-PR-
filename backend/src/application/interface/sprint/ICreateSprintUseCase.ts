import { CreateSprintRequestDTO } from "../../dto/sprint/createSprintRequest.dto";
import { SprintResponseDTO } from "../../dto/sprint/sprintResponse.dto";

export interface ICreateSprintUseCase{
    execute(userId:string,companyId:string,projectId:string,data:CreateSprintRequestDTO):Promise<SprintResponseDTO>
}