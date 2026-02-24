import { StandupMood } from "../../../domain/entities/standup.entity";

export interface CreateStandupRequestDTO {

    yesterday: string;
    today: string;
    blockers?: string | null;
    mood: StandupMood;
}