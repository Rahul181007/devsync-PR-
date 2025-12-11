import { Request,Response } from "express";
import { loginSchema } from "../../application/validators/auth/login.validator";
import { LoginUserUseCase } from "../../application/use-cases/auth/loginUser.usecase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/refreshUserToken.usecase";

export class UseAuthController{
    constructor(private loginUserUseCase:LoginUserUseCase, private refreshTokenUseCase:RefreshTokenUseCase){}

    login=async (req:Request,res:Response)=>{
        try {
            const parsed=loginSchema.parse(req.body);

            const result =await this.loginUserUseCase.execute(parsed);

            return res.json({
                message:'Login successful',
                data:result
            })
        } catch (error:any) {
            return res.status(400).json({ error: error.message });
        }
    }

    refresh=async(req:Request,res:Response)=>{
        try {
           const {refreshToken}=req.body;
           
           if(!refreshToken){
            return res.status(400).json({ error: "Refresh token is required" });
           }

           const token=await this.refreshTokenUseCase.execute(refreshToken);

           return res.json({
            message:'Token refreshed successfully',
            data:token
           })

        } catch (error:any) {
             return res.status(401).json({ error: error.message });
        }
    }
}