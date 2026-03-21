import { z } from "zod";

export const updateWorklogSchema = z.object({
  timeSpent: z.number().min(1, "Time must be greater than 0").optional(),

  description: z.string().trim().optional(),

  date: z.coerce.date().optional(),
});