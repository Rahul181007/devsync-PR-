import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { planController } from "../../di/plan.di";

const router=Router();

router.post('/superadmin/plans',verifyAccessToken,requireRole(Role.SUPER_ADMIN),planController.createPlan);
router.get("/superadmin/plans",verifyAccessToken,requireRole(Role.SUPER_ADMIN),planController.getPlan);
router.get("/superadmin/plans/:planId",verifyAccessToken,requireRole(Role.SUPER_ADMIN),planController.getPlanBYId);
router.put( "/superadmin/plans/:planId",verifyAccessToken,requireRole(Role.SUPER_ADMIN),planController.updatePlan)
router.delete("/superadmin/plans/:planId",verifyAccessToken,requireRole(Role.SUPER_ADMIN),planController.deletePlan);
export default router;