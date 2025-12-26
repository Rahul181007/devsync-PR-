import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { inviteController } from "../../di/invite.di";

const router=Router();

router.post('/superadmin/companies/:companyId/invite',verifyAccessToken,requireRole('SUPER_ADMIN'),inviteController.createCompanyAdminInvite)
router.get ('/invite/verify',inviteController.verifyInvite)
router.post('/invite/accept',inviteController.acceptInvite)
export default router;