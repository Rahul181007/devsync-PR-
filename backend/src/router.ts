import { Router } from "express";
import authRoutes from './interfaces/routes/auth.routes'
import userRoutes from './interfaces/routes/useAuth.routes'
import passwordResetRoutes from './interfaces/routes/passwordReset.routes'
import companyRoutes from './interfaces/routes/company.routes'
import inviteRoutes from './interfaces/routes/invite.routes'
import userMangementRoutes from './interfaces/routes/user.routes'
import projectRoutes from './interfaces/routes/project.routes';
import notificationRoutes from './interfaces/routes/notification.routes';
import planRoutes from './interfaces/routes/plan.routes'
import subscriptionRoutes from "./interfaces/routes/subscription.routes";
import paymentRoutes from "./interfaces/routes/payment.routes";
import invoicesRoutes from "./interfaces/routes/invoice.routes"
const router =Router();

router.use("/auth", authRoutes);
router.use('/auth',userRoutes)
router.use("/auth", passwordResetRoutes);

router.use('/',companyRoutes);
router.use('/',inviteRoutes);
router.use('/',userMangementRoutes);
router.use('/',projectRoutes);
router.use("/",notificationRoutes);
router.use("/",planRoutes)
router.use("/",subscriptionRoutes);
router.use("/",paymentRoutes)
router.use("/",invoicesRoutes)
export default router