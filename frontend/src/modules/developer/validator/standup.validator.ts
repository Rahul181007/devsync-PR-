import { z } from "zod";

export const standupSchema = z.object({
  yesterday: z.string().min(1, "Yesterday is required"),

  today: z.string().min(1, "Today is required"),

  blockers: z.string().optional().transform(val => val || null),

  mood: z.enum(["HAPPY", "GOOD", "NEUTRAL", "STRESSED", "BLOCKED"]),
});