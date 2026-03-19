import {z} from "zod";



export const createTaskSchema = z.object({
  title: z.string().trim().min(1,"task title is required"),
  description: z.string().trim().min(1,"task description is required"),
  type: z.enum(["EPIC", "STORY", "TASK", "BUG"]).optional(),
  priority: z.enum(["LOW","MEDIUM","HIGH"]),
   parentId: z.string().optional().nullable(),

  assigneeId: z.string().trim().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  estimatedTime: z.number().min(0).optional(),
});
