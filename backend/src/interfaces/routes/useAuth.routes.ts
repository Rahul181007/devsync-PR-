import { Router } from "express"; 
import { userAuthController } from "../../di/user.di";

const router=Router();

router.post('/login',userAuthController.login);
router.post('/signup',userAuthController.signup)
router.post('/google/signup',userAuthController.googleSignupUseCase)
router.post("/resend-signup-otp",userAuthController.resendSignUpOtp)
router.post(
  "/verify-signup-otp",
  userAuthController.verifySignupOtp
);

router.post('/google/login',userAuthController.googleLogin)
export default router