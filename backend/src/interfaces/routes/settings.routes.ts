import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { settingsController } from "../../di/settings.di";
import { upload } from "../middleware/upload.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";

const router=Router();

router.post('/send-otp',verifyAccessToken,settingsController.sendOtp);
router.post('/verify-otp',verifyAccessToken,settingsController.verifyOtp);
router.post('/change-password',verifyAccessToken,settingsController.changePassword);
router.get("/profile",verifyAccessToken,settingsController.getProfile);
router.patch("/profile",verifyAccessToken,settingsController.updateProfile);
router.patch("/profile/avatar",verifyAccessToken,upload.single("file"),settingsController.updateAvatar)
router.patch(
  "/company/logo",
  verifyAccessToken,
  upload.single("file"),
  requireRole(Role.COMPANY_ADMIN),
  settingsController.updateCompanyLogo
);
export default router;