import { z } from "zod";

export const updateMeetingSchema = z.object({
    meetingId: z.string(),

    notes: z.string().optional().nullable(),
    decisions: z.string().optional().nullable(),
    meetingLink: z.string().optional().nullable(),

    status: z.enum(["COMPLETED", "CANCELLED"]).optional()
});