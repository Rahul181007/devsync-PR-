import { Router } from "express";
import authRoutes from './interfaces/routes/auth.routes'
import testRoutes from './interfaces/routes/test.routes';
import userRoutes from './interfaces/routes/useAuth.routes'

const router =Router();

router.use("/auth", authRoutes);
router.use('/auth',userRoutes)
router.use('/test',testRoutes)

export default router