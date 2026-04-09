
import { CreateMeetingDTO } from "../../dto/meeting/createMeeting.dto";
import { MeetingResponseDTO } from "../../dto/meeting/meetingResponse.dto";

export interface ICreateMeetingUseCase {
    execute(userId: string,companyId: string, data: CreateMeetingDTO): Promise<MeetingResponseDTO>;
}