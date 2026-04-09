import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { paymentController } from "../../di/payment.di";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";

const router = Router();
router.post(
  "/company/payment/create",
  verifyAccessToken,
  checkUserStatus,
  requireRole(Role.COMPANY_ADMIN),
  paymentController.createPayment
);

router.post(
  "/company/payment/verify",
  verifyAccessToken,
  checkUserStatus,
  requireRole(Role.COMPANY_ADMIN),
  paymentController.verifyPayment
);


router.get(
  "/company/payments",
  verifyAccessToken,
  checkUserStatus,
  requireRole(Role.COMPANY_ADMIN),
  paymentController.getPaymentHistory
);
export default router;