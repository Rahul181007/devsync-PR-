import { Router } from "express";
import { authController } from "../../di/auth.di";
import { verifyAccessToken } from "../middleware/auth.middleware";
const router=Router();

router.post('/superadmin/login',authController.loginSuperAdmin);
router.post('/refresh',authController.refreshToken);
router.post('/logout',authController.logout);
router.get('/me',verifyAccessToken,authController.me)
export default router