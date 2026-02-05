import { IProjectRepository } from "../../../domain/repositories/project.repository";
import { IProjectMemberRepository } from "../../../domain/repositories/projectMember.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { HttpStatus } from "../../../shared/constants/httpStatus";
import { RESPONSE_MESSAGES } from "../../../shared/constants/responseMessages";
import { AppError } from "../../../shared/errors/AppError";
import { GetProjectDetailResponse } from "../../dto/project/getProjectDetailResponse.dto";
import { IGetProjectDetailUseCase } from "../../interface/project/IGetProjectDetailUseCase";

export class GetProjectDetailUseCase implements IGetProjectDetailUseCase {
    constructor(
        private _projectRepo: IProjectRepository,
        private _projectMemberRepo: IProjectMemberRepository,
        private _userRepo: IUserRepository
    ) { }

  async execute(
  userId: string,
  companyId: string,
  projectId: string
): Promise<GetProjectDetailResponse> {
  const user = await this._userRepo.findById(userId);
  if (!user) {
    throw new AppError(RESPONSE_MESSAGES.AUTH.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  const project = await this._projectRepo.findById(projectId);
  if (!project) {
    throw new AppError(RESPONSE_MESSAGES.PROJECT.PROJECT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  if (project.companyId !== companyId) {
    throw new AppError(RESPONSE_MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.FORBIDDEN);
  }

  // Developer access check
  if (user.role === "DEVELOPER") {
    const isMember = await this._projectMemberRepo.isMember(projectId, userId);
    if (!isMember) {
      throw new AppError(RESPONSE_MESSAGES.PROJECT.ACCESS_DENIED, HttpStatus.FORBIDDEN);
    }
  }

  // Fetch members ONCE
  const members = await this._projectMemberRepo.findMembersByProject(projectId);

  const enrichedMembers = await Promise.all(
    members.map(async (member) => {
      const memberUser = await this._userRepo.findById(member.userId);
      if (!memberUser) return null;

      return {
        role: member.role,
        user: {
          id: memberUser.id,
          name: memberUser.name,
          email: memberUser.email,
          role: memberUser.role
        }
      };
    })
  );

  const projectMembers = enrichedMembers.filter(
    (m): m is NonNullable<typeof m> => m !== null
  );

  return {
    ...project,
    members: projectMembers
  };
}
}