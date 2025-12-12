export const userCookieOptions={
    httpOnly:true,
    secure:false,// in production we have to set true
    sameSite:'strict'as const,
    path:'/api/auth/refresh',
    maxAge:7*24*60*60*1000
}