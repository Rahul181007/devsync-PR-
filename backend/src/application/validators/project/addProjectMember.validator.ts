import { z } from "zod";

export const addProjectMemberSchema = z.object({
  userId: z.string().min(1),
});

