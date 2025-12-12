import { Router } from "express";
import { authController } from "../../di/auth.di";

const router=Router();

router.post('/superadmin/login',authController.loginSuperAdmin);
router.post('/superadmin/refresh',authController.refreshToken);
export default router