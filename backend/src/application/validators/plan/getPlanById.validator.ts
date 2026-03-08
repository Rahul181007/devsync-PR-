import { z } from "zod";

export const getPlanByIdSchema = z.object({
  planId: z.string().min(1)
});