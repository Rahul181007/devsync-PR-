import { z } from "zod";

export const updateStandupSchema = z.object({
  yesterday: z.string().min(1, "Yesterday is required"),
  today: z.string().min(1, "Today is required"),
  blockers: z.string().nullable().optional(),
  mood: z.enum([
    "HAPPY",
    "GOOD",
    "NEUTRAL",
    "STRESSED",
    "BLOCKED"
  ])
});
