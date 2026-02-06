import { UpdateProjectDTO } from "../../dto/project/updateProject.dto";
import { UpdateProjectResponse } from "../../dto/project/updateProjectResponse.dto";

export interface IUpdateProjectUseCase {
  execute(
    userId: string,
    companyId: string,
    projectId: string,
    data: UpdateProjectDTO
  ): Promise<UpdateProjectResponse>;
}