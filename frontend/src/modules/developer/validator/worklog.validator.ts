import { z } from "zod";

export const createWorklogSchema = z.object({
  timeSpent: z
    .string()
    .min(1, "Time is required")
    .refine((val) => Number(val) > 0, {
      message: "Enter valid time",
    }),

  description: z.string().optional().transform(val => val || undefined),
});