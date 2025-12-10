import jwt from 'jsonwebtoken';
import { env } from '../../../config/env'; 
import { generateAccessToken } from '../../../shared/utils/token.util';
import { decode } from 'punycode';


export class RefreshTokenUseCase{
    async execute(refreshToken:string){
        try {
            const decoded=jwt.verify(
                refreshToken,
                env.JWT_REFRESH_SECRET
            ) as jwt.JwtPayload

            const payload={
                id:decoded.id ,
                email:decoded.email,
                role:decoded.role,
            }

            const newAccessToken=generateAccessToken(payload)
               
            return {
                accessToken:newAccessToken
            }
        } catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
}