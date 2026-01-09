import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

export type UserRole='SUPER_ADMIN'|'COMPANY_ADMIN'|'DEVELOPER'

export interface AcceessTokenPayload{
  sub:string;
  role:UserRole;
  companyId?:string|null

  onboarding?:boolean
}

export interface RefreshTokenPayload{
  sub:string;
  role:UserRole
}

export class Tokenutilits{
  static generateAccessToken(payload:AcceessTokenPayload):string{
    return jwt.sign(
      payload,
      env.JWT_ACCESS_SECRET as Secret,
      {
        expiresIn:env.ACCESS_TOKEN_EXPIRES_IN as string
      }as SignOptions
    )
  }
  
  static generateRefreshToken (payload:RefreshTokenPayload):string{
    return jwt.sign(
      payload,
      env.JWT_REFRESH_SECRET as Secret,
      {
        expiresIn:env.REFRESH_TOKEN_EXPIRES_IN as string
      }as SignOptions
    )
  }

 }
