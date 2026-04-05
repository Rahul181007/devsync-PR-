import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { userController } from "../../di/userManagement.di";
import { Role } from "../../shared/constants/roleenum";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";

const router = Router();

router.post('/superadmin/users/:userId/block', verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN), userController.blockCompanyAdmin);
router.post('/superadmin/users/:userId/unblock', verifyAccessToken,checkUserStatus, requireRole(Role.SUPER_ADMIN), userController.unblockCompanyAdmin)
router.get('/company/developers', verifyAccessToken,checkUserStatus, requireRole(Role.COMPANY_ADMIN), userController.listDevelopers)
router.post('/company/developers/:userId/block', verifyAccessToken,checkUserStatus, requireRole(Role.COMPANY_ADMIN), userController.blockDevelopers);
router.post('/company/developers/:userId/unblock', verifyAccessToken,checkUserStatus, requireRole(Role.COMPANY_ADMIN), userController.unblockDeveloper)
export default router