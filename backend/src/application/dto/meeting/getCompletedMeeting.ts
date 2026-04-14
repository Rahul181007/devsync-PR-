import { MeetingResponseDTO } from "./meetingResponse.dto";

export interface GetCompletedMeetingsDTO {
    projectId: string;
}

export interface GetCompletedMeetingsResponseDTO {
    items: MeetingResponseDTO[];
}