import { MeetingResponseDTO } from "../../dto/meeting/meetingResponse.dto";
import { UpdateMeetingDTO } from "../../dto/meeting/updateMeeting.dto";

export interface IUpdateMeetingUsecase{
    execute(
        userId:string,
        companyId:string,
        data:UpdateMeetingDTO
    ):Promise<MeetingResponseDTO>
}