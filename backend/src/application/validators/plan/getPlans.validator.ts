import { z } from "zod";

export const getPlansSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === undefined ? undefined : val === "true"
    )
});