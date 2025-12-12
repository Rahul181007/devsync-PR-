import { Request,Response } from "express";
import { loginSchema } from "../../application/validators/auth/login.validator";
import { LoginUserUseCase } from "../../application/use-cases/auth/loginUser.usecase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refreshUserToken.usecase";
import { userCookieOptions } from "../../config/userCookieOptions";


export class UseAuthController{
    constructor(private loginUserUseCase:LoginUserUseCase, private refreshTokenUseCase:RefreshTokenUseCase){}

    login=async (req:Request,res:Response)=>{
        try {
            const parsed=loginSchema.parse(req.body);

            const result =await this.loginUserUseCase.execute(parsed);
             res.cookie(
                'refresh_user',
                result.refreshToken,
                userCookieOptions
             )
            return res.json({
                message:'Login successful',
                data:{
                    id:result.id,
                    name:result.name,
                    email:result.email,
                    role:result.role,
                },
                accessToken:result.accessToken
            })
        } catch (error:any) {
            return res.status(400).json({ error: error.message });
        }
    }

    refresh=async(req:Request,res:Response)=>{
        try {
           const refreshToken=req.cookies.refresh_user;
           
           if(!refreshToken){
            return res.status(400).json({ error: "Refresh token is required" });
           }

           const token=await this.refreshTokenUseCase.execute(refreshToken);

           return res.json({
            message:'Token refreshed successfully',
            accessToken:token.accessToken
           })

        } catch (error:any) {
             return res.status(401).json({ error: error.message });
        }
    }
}