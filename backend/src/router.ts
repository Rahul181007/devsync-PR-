import { Router } from "express";
import authRoutes from './interfaces/routes/auth.routes'
import userRoutes from './interfaces/routes/useAuth.routes'
import passwordResetRoutes from './interfaces/routes/passwordReset.routes'
import companyRoutes from './interfaces/routes/company.routes'
import inviteRoutes from './interfaces/routes/invite.routes'
const router =Router();

router.use("/auth", authRoutes);
router.use('/auth',userRoutes)
router.use("/auth", passwordResetRoutes);

router.use('/',companyRoutes);
router.use('/',inviteRoutes)

export default router