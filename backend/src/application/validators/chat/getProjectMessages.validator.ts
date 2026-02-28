import { z } from "zod";

export const getProjectMessagesSchema = z.object({
  limit: z.number().min(1).max(100),
  cursor: z.string().optional()
});