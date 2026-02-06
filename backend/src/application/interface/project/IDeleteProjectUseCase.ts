export interface IDeleteProjectUseCase {
  execute(
    userId: string,
    companyId: string,
    projectId: string
  ): Promise<void>;
}
