import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { notificationController } from "../../di/notification.di";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";

const router=Router();
router.get("/notifications",verifyAccessToken,checkUserStatus,notificationController.getMyNotification);
router.patch("/notifications/:notificationId/read",verifyAccessToken,checkUserStatus,notificationController.markAsRead)
router.get("/notifications/unread-count",verifyAccessToken,checkUserStatus,notificationController.getUnreadCount);
router.patch("/notifications/read-all",verifyAccessToken,checkUserStatus,notificationController.markAllAsRead);
export default router;