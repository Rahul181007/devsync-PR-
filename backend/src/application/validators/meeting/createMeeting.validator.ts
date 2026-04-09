import { z } from "zod";

export const createMeetingSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),

    sprintId: z.string().optional().nullable(),

    title: z.string().trim().min(3, "Title must be at least 3 characters"),

    description: z.string().optional(),

    scheduledAt: z.coerce.date(),

    durationMinutes: z.number().positive().optional(),

    meetingLink: z.string().url("Invalid meeting link").optional(),

    meetingType: z
        .enum(["GOOGLE_MEET", "ZOOM", "TEAMS", "OTHER"])
        .optional(),
});