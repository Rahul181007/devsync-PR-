import { GetTodayMeetingsDTO } from "../../dto/meeting/getTodayMeetings.dto";
import { GetTodayMeetingsResponseDTO } from "../../dto/meeting/getTodayMeetingsResponse.dto";

export interface IGetTodayMeetingsUseCase {
    execute(
        userId: string,
        companyId: string,
        data: GetTodayMeetingsDTO
    ): Promise<GetTodayMeetingsResponseDTO>;
}