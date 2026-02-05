export interface IRemoveProjectMemberUseCase {
  execute(
    adminUserId: string,
    companyId: string,
    projectId: string,
    memberId: string
  ): Promise<void>;
}
