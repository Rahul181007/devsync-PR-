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

router.get("/superadmin/invoices/:invoiceId/download", verifyAccessToken,requireRole(Role.SUPER_ADMIN),invoiceController.downloadInvoiceForSuperAdmin)

export default router;