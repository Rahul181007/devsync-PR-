import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { transactionController } from "../../di/transaction.di";
import { checkUserStatus } from "../middleware/checkUserStatus.middleware";

const router=Router();

router.get( "/superadmin/transactions",verifyAccessToken,checkUserStatus,requireRole(Role.SUPER_ADMIN),transactionController.getAllTransactions)

export default router