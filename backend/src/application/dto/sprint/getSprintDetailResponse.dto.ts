
import { SprintResponseDTO } from "./sprintResponse.dto";
import { TaskResponseDTO } from "./taskResponse.dto";

export interface GetSprintDetailResponseDTO {
    sprint: SprintResponseDTO;
    tasks: TaskResponseDTO[];
    totalStoryPoints: number;
    completedStoryPoints: number;
    progressPercentage: number;
}