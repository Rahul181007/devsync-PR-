import { z } from "zod";

export const createWorklogSchema = z.object({
  timeSpent: z.number().min(1, "Time must be greater than 0"),

  description: z.string().trim().optional(),

  date: z.coerce.date().optional(),
});