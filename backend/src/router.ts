import { Router } from "express";
import authRoutes from './interfaces/routes/auth.routes'
import testRoutes from './interfaces/routes/test.routes';


const router =Router();

router.use("/auth", authRoutes);
router.use('/test',testRoutes)

export default router