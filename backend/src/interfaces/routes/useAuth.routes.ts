import { Router } from "express"; 
import { userAuthController } from "../../di/user.di";

const router=Router();

router.post('/login',userAuthController.login);
router.post('/signup',userAuthController.signup)

export default router