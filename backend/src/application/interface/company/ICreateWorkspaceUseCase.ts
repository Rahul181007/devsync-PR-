import { CreateWorkspaceDTO } from "../../dto/company/createWorkspace.dto";
import { CreateWorkspaceResponse } from "../../dto/company/createWorkspaceResponse.dto";

export interface ICreateWorkspaceUseCase {
  execute(
    userId: string,
    data: CreateWorkspaceDTO
  ): Promise<CreateWorkspaceResponse>;
}