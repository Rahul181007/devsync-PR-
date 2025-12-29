import { Router } from "express";
import { companyController } from "../../di/company.di";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router=Router();

router.post('/superadmin/companies',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.createCompany);
router.get('/superadmin/companies',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.listCompanies);
router.get('/superadmin/companies/:companyId',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.getCompanyById)
router.patch('/superadmin/companies/:id/approve',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.approveCompany);
router.patch('/superadmin/companies/:id/suspend',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.suspendCompany);

export default router