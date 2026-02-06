import { CreateFirstProjectResponse } from "../../dto/project/createFirstProjectResponse.dto";
import { CreateProjectDTO } from "../../dto/project/createProject.dto";

export interface ICreateFirstProjectUseCase {
  execute(
    userId: string,
    companyId: string,
    data: CreateProjectDTO
  ): Promise<CreateFirstProjectResponse>;
}