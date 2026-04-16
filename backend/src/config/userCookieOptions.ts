export const userCookieOptions = {
  httpOnly: true,
  secure: true, // ✅ MUST BE TRUE in production
  sameSite: 'none' as const, // ✅ MUST BE NONE for cross-origin
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000
};