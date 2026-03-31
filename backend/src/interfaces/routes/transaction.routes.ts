import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { Role } from "../../shared/constants/roleenum";
import { transactionController } from "../../di/transaction.di";

const router=Router();

router.get( "/superadmin/transactions",verifyAccessToken,requireRole(Role.SUPER_ADMIN),transactionController.getAllTransactions)

export default router