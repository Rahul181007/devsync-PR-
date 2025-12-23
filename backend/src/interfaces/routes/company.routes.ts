import { Router } from "express";
import { companyController } from "../../di/company.di";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router=Router();

router.post('/superadmin/companies',verifyAccessToken,requireRole('SUPER_ADMIN'),companyController.createCompany);

export default router