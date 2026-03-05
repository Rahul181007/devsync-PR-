import { z } from "zod";

export const createPlanSchema = z.object({
  name: z
    .string()
    .min(2, "Plan name must be at least 2 characters")
    .max(100, "Plan name is too long"),


  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500),

  pricePerMonth: z
    .number()
    .min(0, "Monthly price must be >= 0"),

  pricePerYear: z
    .number()
    .min(0, "Yearly price must be >= 0"),

  currency: z.enum(["USD", "INR", "EUR"]),

  features: z
    .array(z.string().min(1))
    .max(50),

  limits: z.object({
    maxProjects: z.number().min(-1),
    maxDevelopers: z.number().min(-1),
    maxStorageGB: z.number().min(-1)
  })
});