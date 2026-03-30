import { z } from "zod";

export const validateZod = (
  schema: z.ZodType<unknown>,
  data: unknown
):
  | { success: true; data: unknown }
  | { success: false; errors: Record<string, string> } => {

  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};

  result.error.issues.forEach((err) => {
    const field = err.path[0] as string;
    errors[field] = err.message;
  });

  return { success: false, errors }; // ✅ always exists
};