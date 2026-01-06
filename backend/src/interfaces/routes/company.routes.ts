import { Router } from "express";
import { companyController } from "../../di/company.di";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";
const router=Router();

router.post('/superadmin/companies',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.createCompany);
router.get('/superadmin/companies',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.listCompanies);
router.get('/superadmin/companies/:companyId',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.getCompanyById)
router.patch('/superadmin/companies/:id/approve',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.approveCompany);
router.patch('/superadmin/companies/:id/suspend',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.suspendCompany);


//company- create workspace -onboarding 1
// we have to use Onboarding middle ware with verify access token for routes other than onboarding in company
router.post('/company/workspace',verifyAccessToken,requireRole('COMPANY_ADMIN'),companyController.createWorkspace)
router.get('/company/me',verifyAccessToken,requireRole('COMPANY_ADMIN'),companyController.getMyCompany)
router.patch('/company/branding',verifyAccessToken,requireRole('COMPANY_ADMIN'),upload.single('logo'),companyController.updateBranding)
export default router