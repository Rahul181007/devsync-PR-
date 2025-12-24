import { Router } from "express";
import authRoutes from './interfaces/routes/auth.routes'
import userRoutes from './interfaces/routes/useAuth.routes'
import passwordResetRoutes from './interfaces/routes/passwordReset.routes'
import companyRoutes from './interfaces/routes/company.routes'
const router =Router();

router.use("/auth", authRoutes);
router.use('/auth',userRoutes)
router.use("/auth", passwordResetRoutes);

router.use('/',companyRoutes)

export default router