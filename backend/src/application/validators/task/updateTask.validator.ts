import { z } from "zod";

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),

  type: z.enum(["EPIC", "STORY", "TASK", "BUG"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  assigneeId: z.string().optional().nullable(),

  dueDate: z.coerce.date().optional().nullable(),
});