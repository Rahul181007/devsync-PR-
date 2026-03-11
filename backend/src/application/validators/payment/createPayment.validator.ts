import { z } from "zod";

export const createPaymentSchema = z.object({
  planId: z
    .string()
    .min(1, "Plan ID is required"),

  billingCycle: z.enum(["MONTHLY", "YEARLY"], { error: "Invalid billing cycle" })
  });