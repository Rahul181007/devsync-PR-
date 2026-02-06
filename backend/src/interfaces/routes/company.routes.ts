import { Router } from "express";
import { companyController } from "../../di/company.di";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";
import { Role } from "../../shared/constants/roleenum";
const router=Router();

router.post('/superadmin/companies',verifyAccessToken,requireRole(Role.SUPER_ADMIN),companyController.createCompany);
router.get('/superadmin/companies',verifyAccessToken,requireRole(Role.SUPER_ADMIN),companyController.listCompanies);
router.get('/superadmin/companies/:companyId',verifyAccessToken,requireRole(Role.SUPER_ADMIN),companyController.getCompanyById)
router.patch('/superadmin/companies/:id/approve',verifyAccessToken,requireRole(Role.SUPER_ADMIN),companyController.approveCompany);
router.patch('/superadmin/companies/:id/suspend',verifyAccessToken,requireRole(Role.SUPER_ADMIN),companyController.suspendCompany);
router.post('/superadmin/companies/:id/reject',verifyAccessToken,requireRole(Role.SUPER_ADMIN),companyController.rejectCompany);
router.patch('/superadmin/companies/:id/unsuspend',verifyAccessToken,requireRole(Role.SUPER_ADMIN),companyController.unsuspendCompany);


//company- create workspace -onboarding 1
// we have to use Onboarding middle ware with verify access token for routes other than onboarding in company
router.post('/company/workspace',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),companyController.createWorkspace)
router.get('/company/me',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),companyController.getMyCompany)
router.patch('/company/branding',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),upload.single('logo'),companyController.updateBranding)
router.post('/company/reapply',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),companyController.reapplyCompany)
export default router