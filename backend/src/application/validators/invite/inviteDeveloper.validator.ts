import { z } from "zod";

export const inviteDeveloperSchema = z.object({
  email: z.string().email()
});
