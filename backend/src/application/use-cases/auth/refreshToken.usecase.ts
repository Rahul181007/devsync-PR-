import jwt from 'jsonwebtoken';
import { env } from '../../../config/env'; 
import { Tokenutilits } from '../../../shared/utils/token.util';
import { AppError } from '../../../shared/errors/AppError';
import { ISuperAdminRepository } from '../../../domain/repositories/superAdmin.repository';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { RequestUser } from '../../../shared/types/AuthUser';
interface RefreshTokenPayload{
    sub:string;
    role:'SUPER_ADMIN'|'COMPANY_ADMIN'|'DEVELOPER'
}

export class RefreshTokenUseCase{
  constructor(private readonly superadminrepo:ISuperAdminRepository,private readonly userRepo:IUserRepository){}

  async execute(refreshToken:string){
    
    const decoded=jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET
    )as RefreshTokenPayload

    if(!decoded.sub){
        throw new AppError('Invalid refresh token',401)
    }

    let user:RequestUser|null=null;

    switch(decoded.role){
        case 'SUPER_ADMIN':{
        const superAdmin=await this.superadminrepo.findById(decoded.sub)
        if(!superAdmin)break;
        user={
            id:superAdmin.id,
            role:superAdmin.role
        }
        break;
    }
        case 'COMPANY_ADMIN':
        case 'DEVELOPER':{
          const  CDuser=await this.userRepo.findById(decoded.sub);
          if(!CDuser) break;
          user={
            id:CDuser.id,
            role:CDuser.role,
            companyId:CDuser.companyId??null
          }
            break;
        }
        default:
            throw new AppError('Unauthorized Role',401)
    }

    if(!user){
        throw new AppError('Account not found',404)
    }


    const payload={
        sub:user.id,
        role:user.role,
        companyId:user.companyId??null
    }

    const newAccessToken=Tokenutilits.generateAccessToken(payload)
    
    const newRefreshToken=Tokenutilits.generateRefreshToken({sub:user.id,role:user.role})
    return {
        accessToken:newAccessToken,
        refreshToken:newRefreshToken,
        user:{
            id:user.id,
            role:user.role
        }
    }
}
}
