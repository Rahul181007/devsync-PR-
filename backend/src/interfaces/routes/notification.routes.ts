import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { notificationController } from "../../di/notification.di";

const router=Router();
router.get("/notifications",verifyAccessToken,notificationController.getMyNotification);
router.patch("/notifications/:notificationId/read",verifyAccessToken,notificationController.markAsRead)
router.get("/notifications/unread-count",verifyAccessToken,notificationController.getUnreadCount);
router.patch("/notifications/read-all",verifyAccessToken,notificationController.markAllAsRead);
export default router;