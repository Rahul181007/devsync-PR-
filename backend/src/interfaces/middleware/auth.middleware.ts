import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { env } from "../../config/env";

export interface AuthRequest extends Request{
    user?:any
}

export const verifyAccessToken=(
    req:AuthRequest,
    res:Response,
    next:NextFunction
)=>{
    try {
        const authHeader = req.headers.authorization as string;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({error:'Unauthorized No token Provided'})
        }
        const token =authHeader.split(' ')[1];
        const decoded=jwt.verify(token,env.JWT_ACCESS_SECRET)

        req.user=decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}