import { MeetingResponseDTO } from "./meetingResponse.dto";

export interface ListMeetingsResponseDTO {
    items: MeetingResponseDTO[];
    total: number;
    page: number;
    limit: number;
}