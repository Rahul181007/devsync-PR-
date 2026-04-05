import { Router } from "express";
import { companyController } from "../../di/company.di";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";
import { Role } from "../../shared/constants/roleenum";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";
const router=Router();

router.post('/superadmin/companies',verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),companyController.createCompany);
router.get('/superadmin/companies',verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),companyController.listCompanies);
router.get('/superadmin/companies/:companyId',verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),companyController.getCompanyById)
router.patch('/superadmin/companies/:id/approve',verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),companyController.approveCompany);
router.patch('/superadmin/companies/:id/suspend',verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),companyController.suspendCompany);
router.post('/superadmin/companies/:id/reject',verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),companyController.rejectCompany);
router.patch('/superadmin/companies/:id/unsuspend',verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),companyController.unsuspendCompany);


//company- create workspace -onboarding 1
// we have to use Onboarding middle ware with verify access token for routes other than onboarding in company
router.post('/company/workspace',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),companyController.createWorkspace)
router.get('/company/me',verifyAccessToken,checkUserStatus,companyController.getMyCompany)
router.patch('/company/branding',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),upload.single('logo'),companyController.updateBranding)
router.post('/company/reapply',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),companyController.reapplyCompany)
export default router