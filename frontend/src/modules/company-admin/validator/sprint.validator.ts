import { z } from "zod";

export const createSprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required"),

  goal: z.string().optional().transform(val => val || undefined),

  startDate: z.string().min(1, "Start date is required"),

  endDate: z.string().min(1, "End date is required"),
}).refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);