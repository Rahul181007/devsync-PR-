import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../../config/env";

export const generateAccessToken = (payload: Record<string, any>) => {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET as Secret,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as string,
    } as SignOptions
  );
};

export const generateRefreshToken = (payload: Record<string, any>) => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as string,
    } as SignOptions
  );
};
