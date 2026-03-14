import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { userController } from "../../di/userManagement.di";
import { Role } from "../../shared/constants/roleenum";

const router = Router();

router.post('/superadmin/users/:userId/block', verifyAccessToken, requireRole(Role.SUPER_ADMIN), userController.blockCompanyAdmin);
router.post('/superadmin/users/:userId/unblock', verifyAccessToken, requireRole(Role.SUPER_ADMIN), userController.unblockCompanyAdmin)
router.get('/company/developers', verifyAccessToken, requireRole(Role.COMPANY_ADMIN), userController.listDevelopers)
router.post('/company/developers/:userId/block', verifyAccessToken, requireRole(Role.COMPANY_ADMIN), userController.blockDevelopers);
router.post('/company/developers/:userId/unblock', verifyAccessToken, requireRole(Role.COMPANY_ADMIN), userController.unblockDeveloper)
export default router