import { GetAvailablePlansResponseDTO } from "../../dto/plan/getAvailablePlansResponse.dto";

export interface IGetAvailablePlansUseCase {
  execute(userId: string,companyId: string): Promise<GetAvailablePlansResponseDTO[]>;
}