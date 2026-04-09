import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { projectController } from "../../di/project.di";
import { Role } from "../../shared/constants/roleenum";
import { taskController } from "../../di/task.di";
import { sprintController } from "../../di/sprint.di";
import { standupController } from "../../di/standup.di";
import { chatController } from "../../di/chat.di";
import { aiController } from "../../di/ai.di";
import { taskCommentController } from "../../di/taskComment.di";
import { upload } from "../middleware/upload.middleware";
import { taskAttachmentController } from "../../di/taskAttachment.di";
import { worklogController } from "../../di/worklog.di";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";


const router=Router();

//project module
router.post('/company/projects/first',verifyAccessToken,requireRole(Role.COMPANY_ADMIN),projectController.createFirstProject)
router.get('/company/projects',verifyAccessToken,checkUserStatus,projectController.listProjects);
router.get('/company/projects/:projectId',verifyAccessToken,checkUserStatus,projectController.getProjectDetail)
router.patch('/company/projects/:projectId',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),projectController.updateProject);
router.delete('/company/projects/:projectId',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),projectController.deleteProject);
router.post('/company/projects',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),projectController.createProject);
router.post ('/company/projects/:projectId/members',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),projectController.addProjectMember);
router.delete('/company/projects/:projectId/members/:memberId',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),projectController.removeProjectMember)

//task module
router.post("/company/projects/:projectId/tasks",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),taskController.createTask)
router.get("/company/projects/:projectId/tasks",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),taskController.getProjectTasks)
router.get('/company/projects/:projectId/tasks/:taskId',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),taskController.getTaskDetail);
router.patch("/company/projects/:projectId/tasks/:taskId/status",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),taskController.updateTaskStatus)

router.get("/developer/projects/:projectId/tasks",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),taskController.getDeveloperTask);
router.get("/developer/projects/:projectId/tasks/:taskId",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),taskController.getDeveloperTaskDetail)
router.patch("/developer/projects/:projectId/tasks/:taskId/status",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),taskController.updateDeveloperTaskUseCase);
router.patch("/developer/projects/:projectId/tasks/:taskId/submit",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),taskController.submitTask)



router.patch("/company/projects/:projectId/tasks/:taskId",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),taskController.updateTask);

router.post("/projects/:projectId/tasks/:taskId/comments",verifyAccessToken,checkUserStatus,taskCommentController.addComment)
router.get("/projects/:projectId/tasks/:taskId/comments",verifyAccessToken,checkUserStatus,taskCommentController.getComments)

router.post("/projects/:projectId/tasks/:taskId/attachments",verifyAccessToken,checkUserStatus,upload.single("file"), taskAttachmentController.uploadAttachment);
router.get("/projects/:projectId/tasks/:taskId/attachments",verifyAccessToken,checkUserStatus,taskAttachmentController.getAttachments);


//sprint-module

router.post("/company/projects/:projectId/sprints",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),sprintController.createSprint)
router.get("/company/projects/:projectId/sprints",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),sprintController.getProjectSprints);
router.get("/company/projects/:projectId/sprints/:sprintId",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),sprintController.getSprintDetail);
router.patch("/company/projects/:projectId/sprints/:sprintId/activate",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),sprintController.activateSprint)
router.patch("/company/projects/:projectId/sprints/:sprintId/complete",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),sprintController.completeSprint)
router.patch("/company/projects/:projectId/sprints/:sprintId/plan",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),sprintController.planSprint)


//standup-module-developer
router.post ('/developer/projects/:projectId/standups',verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),standupController.createStandup)
router.get("/developer/projects/:projectId/standups",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),standupController.getMyCurrentSprintStandups)
router.put('/developer/projects/:projectId/standups',verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),standupController.updateStandup)


//standup-module- companyadmin
router.get('/company/projects/:projectId/standups/today',verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),standupController.getSprintTodaySummary);
router.get("/company/projects/:projectId/standups/history",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),standupController.getSprintHistorySummary);
router.get( "/company/projects/:projectId/standups/:standupId",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),standupController.getStandupDetail)


//chat module
router.get('/projects/:projectId/chat',verifyAccessToken,checkUserStatus,chatController.getProjectMessage);
router.post("/projects/:projectId/chat",verifyAccessToken,checkUserStatus,upload.single("file"),chatController.sendMessage)
// ai module
router.get("/projects/:projectId/ai-summary",verifyAccessToken,checkUserStatus,aiController.getProjectAISummary);


// worklog module

router.post("/developer/projects/:projectId/tasks/:taskId/worklogs",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),worklogController.createWorklog);
router.patch("/developer/projects/:projectId/worklogs/:worklogId",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),worklogController.updateWorklog);

router.delete("/developer/projects/:projectId/worklogs/:worklogId",verifyAccessToken,checkUserStatus,requireRole(Role.DEVELOPER),worklogController.deleteWorklog);
router.get("/projects/:projectId/tasks/:taskId/worklogs",verifyAccessToken,checkUserStatus,worklogController.getByTask);

// Admin → project timesheet
router.get("/company/projects/:projectId/worklogs",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),worklogController.getByProject);
router.get("/company/projects/:projectId/timesheet",verifyAccessToken,checkUserStatus,requireRole(Role.COMPANY_ADMIN),worklogController.getTimesheetByProject)
export default router;