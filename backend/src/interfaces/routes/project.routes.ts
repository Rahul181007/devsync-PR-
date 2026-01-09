import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { projectController } from "../../di/project.di";

const router=Router();

router.post('/company/projects',verifyAccessToken,requireRole('COMPANY_ADMIN'),projectController.createFirstProject)

export default router;