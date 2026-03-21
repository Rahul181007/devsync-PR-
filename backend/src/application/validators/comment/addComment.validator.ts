import { z } from "zod";

export const addCommentSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long"),
});