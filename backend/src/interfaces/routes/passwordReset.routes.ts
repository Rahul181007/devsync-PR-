import { Router } from "express";
import { passwordResetController } from "../../di/passwordReset.di";


const router=Router();

router.post('/forgot-password',passwordResetController.sendOtp);
router.post('/verify-otp',passwordResetController.verifyOtp);
router.post('/reset-password',passwordResetController.resetPassword);

export default router