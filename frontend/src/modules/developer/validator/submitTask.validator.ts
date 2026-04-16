import { z } from "zod";

export const submitTaskSchema = z.object({
  summary: z.string().min(1, "Summary is required"),

  workDone: z.string().min(1, "Work done is required"),

  blockers: z.string().optional().transform(val => val || undefined),
});