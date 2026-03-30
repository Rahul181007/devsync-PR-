import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),

  description: z.string().optional(),

  startDate: z
    .string()
    .optional()
    .transform((val) => val || undefined),

  endDate: z
    .string()
    .optional()
    .transform((val) => val || undefined),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

// extend for modal
export const projectWithMembersSchema = projectSchema.safeExtend({
  members: z.array(
    z.object({
      userId: z.string().min(1),
    })
  ).optional(),
});