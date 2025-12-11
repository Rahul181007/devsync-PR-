import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { generateAccessToken } from '../../../shared/utils/token.util';

export class RefreshTokenUseCase{
    constructor(private userRepo:IUserRepository){}

    async execute(refreshToken:string){
        try {
            const decoded=jwt.verify(
                refreshToken,
                env.JWT_REFRESH_SECRET
            )as jwt.JwtPayload

        if(!decoded.id){
            throw new Error ('Invalid refresh token')
          }

            const user =await this.userRepo.findById(decoded.id);

           if(!user){
            throw new Error ('User not found')
           }

         const payload ={
            id:user.id,
            name:user.name,
            role:user.role
         }

         const newAccessToken=generateAccessToken(payload)

         return {
            accessToken:newAccessToken,
            refreshToken
         }

        } catch (error) {
             throw new Error("Invalid or expired refresh token");
        }
    }
}