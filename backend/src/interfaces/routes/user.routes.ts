import { Router } from "express"; 
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { userController } from "../../di/userManagement.di";

const router=Router();

router.post('/superadmin/users/:userId/block',verifyAccessToken,requireRole('SUPER_ADMIN'),userController.blockCompanyAdmin); 
router.post('/superadmin/users/:userId/unblock',verifyAccessToken,requireRole('SUPER_ADMIN'),userController.unblockCompanyAdmin)
router.get('/company/developers',verifyAccessToken,requireRole('COMPANY_ADMIN'),userController.listDevelopers)

export default router