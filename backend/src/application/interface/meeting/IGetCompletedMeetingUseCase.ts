import { GetCompletedMeetingsDTO, GetCompletedMeetingsResponseDTO } from "../../dto/meeting/getCompletedMeeting";

export interface IGetCompletedMeetingsUseCase {
    execute(
        userId: string,
        companyId: string,
        data: GetCompletedMeetingsDTO
    ): Promise<GetCompletedMeetingsResponseDTO>;
}