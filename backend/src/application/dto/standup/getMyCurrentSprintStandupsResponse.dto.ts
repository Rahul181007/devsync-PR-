import { Standup } from "../../../domain/entities/standup.entity";

export interface GetMyCurrentSprintStandupsResponseDTO {
  sprintId: string;
  sprintStatus: string;
  todayStandup: Standup | null;
  history: Standup[];
}
