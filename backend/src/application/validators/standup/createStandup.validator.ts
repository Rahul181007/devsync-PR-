import { z } from "zod"

export const createStandupSchema = z.object({

    yesterday: z.string().min(3, "Yesterday update is required"),
    today: z.string().min(3, "Today update is required"),

    blockers: z.string().nullable().optional(),

    mood: z.enum([
        "HAPPY",
        "GOOD",
        "NEUTRAL",
        "STRESSED",
        "BLOCKED"
    ])
})