import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { projectController } from "../../di/project.di";

const router=Router();

router.post('/company/projects/first',verifyAccessToken,requireRole('COMPANY_ADMIN'),projectController.createFirstProject)
router.get('/company/projects',verifyAccessToken,projectController.listProjects);
router.get('/company/projects/:projectId',verifyAccessToken,projectController.getProjectDetail)
router.patch('/company/projects/:projectId',verifyAccessToken,requireRole('COMPANY_ADMIN'),projectController.updateProject);
router.delete('/company/projects/:projectId',verifyAccessToken,requireRole('COMPANY_ADMIN'),projectController.deleteProject);
router.post('/company/projects',verifyAccessToken,requireRole('COMPANY_ADMIN'),projectController.createProject);
router.post ('/company/projects/:projectId/members',verifyAccessToken,requireRole('COMPANY_ADMIN'),projectController.addProjectMember);
router.delete('/company/projects/:projectId/members/:memberId',verifyAccessToken,requireRole('COMPANY_ADMIN'),projectController.removeProjectMember)
export default router;