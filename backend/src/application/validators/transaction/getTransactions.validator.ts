import { z } from "zod";

export const getTransactionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  status: z
    .enum(["PENDING", "SUCCESS", "FAILED"])
    .optional(),

  search: z.string().trim().optional(),

  fromDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid fromDate"
    })
    .optional(),

  toDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid toDate"
    })
    .optional()
});