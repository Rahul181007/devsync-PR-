export const superAdminCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000
};