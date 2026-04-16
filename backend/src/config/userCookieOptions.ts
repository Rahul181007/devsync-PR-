export const userCookieOptions={
    httpOnly:true,
  secure: true,          // ✅ MUST be true in production
  sameSite: 'none' as const,
     path: '/',
    maxAge:7*24*60*60*1000
}