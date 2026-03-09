import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { subscriptionController } from "../../di/subscription.di";

const router=Router();

router.get("/company/subscription",verifyAccessToken,requireRole(Role.COMPANY_ADMIN),subscriptionController.getCompanySubscription)

export default router