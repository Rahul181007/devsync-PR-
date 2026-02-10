import {z} from "zod";



export const createTaskSchema = z.object({
  title: z.string().trim().min(1,"task title is required"),
  description: z.string().trim().min(1,"task description is required"),

  priority: z.enum(["LOW","MEDIUM","HIGH"]),

  assigneeId: z.string().trim().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});
