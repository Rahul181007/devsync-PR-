import { CreateProjectResponse } from "../../dto/project/createProjectResponse.dto";
import { CreateProjectWithMembersDTO } from "../../dto/project/createProjectWithMembers.dto";

export interface ICreateProjectUseCase {
  execute(
    userId: string,
    companyId: string,
    data: CreateProjectWithMembersDTO
  ): Promise<CreateProjectResponse>;
}