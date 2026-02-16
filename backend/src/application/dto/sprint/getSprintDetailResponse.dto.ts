import { Task } from "../../../domain/entities/task.entity";
import { SprintResponseDTO } from "./sprintResponse.dto";

export interface GetSprintDetailResponseDTO{
    sprint:SprintResponseDTO;
    tasks:Task[]
}