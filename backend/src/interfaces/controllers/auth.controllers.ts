import { Request,Response } from "express";
import { loginSchema } from "../../application/validators/auth/login.validator";
import { LoginSuperAdminUseCase } from "../../application/use-cases/auth/loginSuperAdmin.usecase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refreshToken.usecase";
import { superAdminCookieOptions } from "../../config/superAdminCookieOption";

export class AuthController{
    constructor(private loginSuperAdminUseCase:LoginSuperAdminUseCase,
        private refreshTokenUseCase:RefreshTokenUseCase
    ){}

    loginSuperAdmin=async(req:Request,res:Response)=>{
        try {
            const parsed = loginSchema.parse(req.body);

            const result =await this.loginSuperAdminUseCase.execute(parsed);

            // store RefreshToken inside cookie
            res.cookie(
                'refresh_superAdmin',
                result.refreshToken,
                superAdminCookieOptions
            )



            return res.json({
                message:'Login successful',
                data:{
                    id:result.id,
                    name:result.name,
                    email:result.email,
                    role:result.role,
                },
                accessToken:result.accessToken,
            })
        } catch (error:any) {
            return res.status(400).json({error:error.message})
        }
    }

    // refresh token
    refreshToken=async (req:Request,res:Response)=>{
        try {
            const refreshToken=req.cookies.refresh_superAdmin;

            if(!refreshToken){
                return res.status(400).json({ error: "Refresh token is required" });
            }

            const result = await this.refreshTokenUseCase.execute(refreshToken);

    return res.json({
        message: "New access token generated",
        accessToken: result.accessToken,
        user:result.user
      });

        } catch (error:any) {
            return res.status(401).json({ error: error.message });
        }
    }
}