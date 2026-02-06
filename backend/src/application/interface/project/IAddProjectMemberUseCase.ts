import { AddProjectMemberDTO } from "../../dto/project/addProjectMember.dto";

export interface IAddProjectMemberUseCase {
  execute(
    adminUserId: string,
    companyId: string,
    projectId: string,
    data: AddProjectMemberDTO
  ): Promise<void>;
}