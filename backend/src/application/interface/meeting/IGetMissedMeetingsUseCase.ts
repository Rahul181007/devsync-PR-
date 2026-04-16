import { GetMissedMeetingsDTO, GetMissedMeetingsResponseDTO } from "../../dto/meeting/getMissedMeetings.dto";

export interface IGetMissedMeetingsUseCase {
    execute(
        userId: string,
        companyId: string,
        data: GetMissedMeetingsDTO
    ): Promise<GetMissedMeetingsResponseDTO>;
}