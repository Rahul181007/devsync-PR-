export interface IResetPasswordForAuthenticatedUserUseCase {
  execute(
    userId: string,
    newPassword: string
  ): Promise<{
    message: string;
  }>;
}