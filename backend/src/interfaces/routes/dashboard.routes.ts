import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { dashBoardController } from "../../di/dashboard.di";

const router = Router();

router.get("/superadmin/dashboard",verifyAccessToken,requireRole(Role.SUPER_ADMIN),dashBoardController.getDashBoardForSuperAdmin);
router.get("/company/dashboard",verifyAccessToken,requireRole(Role.COMPANY_ADMIN),dashBoardController.getDashboardForCompanyAdmin);
router.get("/developer/dashboard",verifyAccessToken,requireRole(Role.DEVELOPER),dashBoardController.getDashboardForDeveloper)
export default router