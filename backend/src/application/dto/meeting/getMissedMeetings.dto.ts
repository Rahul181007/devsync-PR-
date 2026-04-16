
import { MeetingResponseDTO } from "./meetingResponse.dto";

export interface GetMissedMeetingsDTO {
    projectId: string;
}

export interface GetMissedMeetingsResponseDTO {
    items: MeetingResponseDTO[];
}