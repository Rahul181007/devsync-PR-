import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { invoiceController } from "../../di/invoice.di";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";

const router = Router();

router.get(
  "/company/invoice/:invoiceId",
  verifyAccessToken,
  checkUserStatus,
  requireRole(Role.COMPANY_ADMIN),
  invoiceController.downloadInvoice
);

router.get("/superadmin/invoices/:invoiceId/download", verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),invoiceController.downloadInvoiceForSuperAdmin)

export default router;