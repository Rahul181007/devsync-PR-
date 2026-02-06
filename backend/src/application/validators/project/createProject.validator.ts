import {z} from 'zod';

export const createProjectSchema=z.object({
    name:z.string().min(2).max(100),
    description:z.string().optional(),
    startDate:z.coerce.date().optional(),
    endDate:z.coerce.date().optional(),
})



export const createProjectWithMembersSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  members: z.array(
    z.object({
      userId: z.string().min(1),
    })
  ).optional()
});
