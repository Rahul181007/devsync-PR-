import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { projectController } from "../../di/project.di";
import { Role } from "../../shared/constants/roleenum";
import { taskController } from "../../di/task.di";


const router=Router();

//project module
router.post('/company/projects/first',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),projectController.createFirstProject)
router.get('/company/projects',verifyAccessToken,projectController.listProjects);
router.get('/company/projects/:projectId',verifyAccessToken,projectController.getProjectDetail)
router.patch('/company/projects/:projectId',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),projectController.updateProject);
router.delete('/company/projects/:projectId',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),projectController.deleteProject);
router.post('/company/projects',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),projectController.createProject);
router.post ('/company/projects/:projectId/members',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),projectController.addProjectMember);
router.delete('/company/projects/:projectId/members/:memberId',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),projectController.removeProjectMember)

//task module
router.post("/company/projects/:projectId/task",verifyAccessToken,requireRole(Role.COMPANY_ADMIN),taskController.createTask)
router.get("/company/projects/:projectId/tasks",verifyAccessToken,requireRole(Role.COMPANY_ADMIN),taskController.getProjectTasks)
router.get('/company/projects/:projectId/tasks/:taskId',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),taskController.getTaskDetail);
router.patch("/company/projects/:projectId/tasks/:taskId/status",verifyAccessToken,requireRole(Role.COMPANY_ADMIN),taskController.updateTaskStatus)

router.get("/developer/projects/:projectId/tasks",verifyAccessToken,requireRole(Role.DEVELOPER),taskController.getDeveloperTask);
router.get("/developer/projects/:projectId/tasks/:taskId",verifyAccessToken,requireRole(Role.DEVELOPER),taskController.getDeveloperTaskDetail)
router.patch("/developer/projects/:projectId/tasks/:taskId/status",verifyAccessToken,requireRole(Role.DEVELOPER),taskController.updateDeveloperTaskUseCase);
router.patch("/developer/projects/:projectId/tasks/:taskId/submit",verifyAccessToken,requireRole(Role.DEVELOPER),taskController.submitTask)
export default router;