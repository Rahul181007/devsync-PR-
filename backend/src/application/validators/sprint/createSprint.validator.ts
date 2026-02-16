import { z } from "zod";

export const createSprintSchema = z.object({
  name: z.string().trim().min(1, "Sprint name is required"),

  goal: z.string().trim().optional().nullable(),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),
}).refine(
  (data) => data.startDate < data.endDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);
