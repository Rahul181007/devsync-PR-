import { Router } from "express";

import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router=Router();

router.get('/protected',verifyAccessToken,requireRole('SUPER_ADMIN'),(req,res)=>{
    return res.json({
        message:'You accessed a Protected route',
        user:(req as any).user
    })
})

export default router