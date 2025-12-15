import jwt from 'jsonwebtoken';
import { env } from '../../../config/env'; 
import { generateAccessToken } from '../../../shared/utils/token.util';
import { ISuperAdminRepository } from '../../../domain/repositories/superAdmin.repository';




export class RefreshTokenUseCase{
    constructor(private superAdminRepo:ISuperAdminRepository){}
    async execute(refreshToken:string){
        try {
            const decoded=jwt.verify(
                refreshToken,
                env.JWT_REFRESH_SECRET
            ) as jwt.JwtPayload
            if(!decoded.id){
                throw new Error('Invalid refresh token')
            }

            const superadmin =await this.superAdminRepo.findById(decoded.id);
            if(!superadmin){
                throw new Error('Super Admin not found')
            }
            const payload={
                id:superadmin.id ,
                email:superadmin.email,
                role:superadmin.role,
            }

            const newAccessToken=generateAccessToken(payload)
               
            return {
                accessToken:newAccessToken,
                user:{
                    id:superadmin.id,
                    name:superadmin.name,
                    email:superadmin.email,
                    role:superadmin.role

                }
            }
        } catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
}