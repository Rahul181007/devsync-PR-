import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { settingsController } from "../../di/settings.di";
import { upload } from "../middleware/upload.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";

const router=Router();

router.post('/send-otp',verifyAccessToken,checkUserStatus,settingsController.sendOtp);
router.post('/verify-otp',verifyAccessToken,checkUserStatus,settingsController.verifyOtp);
router.post('/change-password',verifyAccessToken,checkUserStatus,settingsController.changePassword);
router.get("/profile",verifyAccessToken,checkUserStatus,settingsController.getProfile);
router.patch("/profile",verifyAccessToken,checkUserStatus,settingsController.updateProfile);
router.patch("/profile/avatar",verifyAccessToken,checkUserStatus,upload.single("file"),settingsController.updateAvatar)
router.patch(
  "/company/logo",
  verifyAccessToken,
  checkUserStatus,
  upload.single("file"),
  requireRole(Role.COMPANY_ADMIN),
  settingsController.updateCompanyLogo
);
export default router;