import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { env } from "../../config/env";
import { AcceessTokenPayload } from "../../shared/utils/token.util";

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token" });
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)as jwt.JwtPayload &AcceessTokenPayload;
    req.user = {
        id:decoded.sub,
        role:decoded.role,
        companyId:decoded.companyId,
        onboarding: decoded.onboarding??false
    };
    next();
  } catch (error:unknown) {
  if (error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      code: "ACCESS_TOKEN_EXPIRED",
      message: "Access token expired"
    });
  }

  return res.status(401).json({
    code: "ACCESS_TOKEN_INVALID",
    message: "Invalid access token"
  });
  }
};
