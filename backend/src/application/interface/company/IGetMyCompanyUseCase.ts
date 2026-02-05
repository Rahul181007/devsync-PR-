import { GetMyCompanyResponse } from "../../dto/company/getMyCompanyResponse.dto";

export interface IGetMyCompanyUseCase {
  execute(companyId: string): Promise<GetMyCompanyResponse>;
}