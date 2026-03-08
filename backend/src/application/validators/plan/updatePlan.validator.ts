import { z } from "zod";

export const updatePlanSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  pricePerMonth: z.number().min(0).optional(),
  pricePerYear: z.number().min(0).optional(),
  currency: z.enum(["USD", "INR", "EUR"]).optional(),
  features: z.array(z.string()).optional(),
  limits: z.object({
    maxProjects: z.number().optional(),
    maxDevelopers: z.number().optional(),
    maxStorageGB: z.number().optional()
  }).optional(),
  isActive: z.boolean().optional()
});