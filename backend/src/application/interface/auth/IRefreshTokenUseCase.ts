export interface IRefreshTokenUseCase {
  execute(
    refreshToken: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'DEVELOPER';
    };
  }>;
}
