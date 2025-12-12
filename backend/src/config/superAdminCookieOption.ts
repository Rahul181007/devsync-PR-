export const superAdminCookieOptions={
    httpOnly:true,
    secure:false,// in production we have to set true
    sameSite:'strict'as const,
    path:'/api/auth/superadmin/refresh',
    maxAge:7*24*60*60*1000
}