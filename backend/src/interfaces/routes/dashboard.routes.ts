import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { dashBoardController } from "../../di/dashboard.di";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";

const router = Router();

router.get("/superadmin/dashboard",verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),dashBoardController.getDashBoardForSuperAdmin);
router.get("/company/dashboard",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),dashBoardController.getDashboardForCompanyAdmin);
router.get("/developer/dashboard",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),dashBoardController.getDashboardForDeveloper)
export default router