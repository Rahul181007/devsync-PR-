import { GetProjectDetailResponse } from "../../dto/project/getProjectDetailResponse.dto";

export interface IGetProjectDetailUseCase {
  execute(
    userId: string,
    companyId: string,
    projectId: string
  ): Promise<GetProjectDetailResponse>;
}