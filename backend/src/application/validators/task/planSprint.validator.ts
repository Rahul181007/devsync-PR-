import { z } from "zod";

export const planSprintSchema = z.object({
  sprintId: z.string().min(1, "Sprint ID is required"),

  tasks: z
    .array(
      z.object({
        taskId: z.string().min(1, "Task ID is required"),
        developerId: z.string().min(1, "Developer ID is required"),
      })
    )
    .min(1, "At least one task must be selected"),
});
