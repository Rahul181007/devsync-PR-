import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { invoiceController } from "../../di/invoice.di";

const router = Router();

router.get(
  "/company/invoice/:invoiceId",
  verifyAccessToken,
  requireRole(Role.COMPANY_ADMIN),
  invoiceController.downloadInvoice
);

export default router;