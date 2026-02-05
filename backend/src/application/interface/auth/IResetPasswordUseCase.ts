export interface IResetPasswordUseCase {
  execute(
    email: string,
    newPassword: string
  ): Promise<{
    message: string;
  }>;
}