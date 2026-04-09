import { ListMeetingsDTO } from "../../dto/meeting/listMeetings.dto";
import { ListMeetingsResponseDTO } from "../../dto/meeting/listMeetingsResponse.dto";

export interface IGetMeetingsUseCase {
    execute(
        userId: string,
        companyId: string,
        data: ListMeetingsDTO
    ): Promise<ListMeetingsResponseDTO>;
}