import { SprintResponseDTO } from "../../dto/sprint/sprintResponse.dto";

export interface IListSprintUseCase{
    execute(
        userId:string,
        companyId:string,
        projectId:string
    ):Promise<SprintResponseDTO[]>
}