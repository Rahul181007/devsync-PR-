import dotenv from "dotenv";
import { z } from "zod";

import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

/* ================= Schema ================= */

const envSchema = z.object({
  PORT: z.string().default("4000"),

  MONGO_URL: z.string().min(1, "MONGO_URL missing"),

  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),

  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),

  FRONTEND_URL: z.string().default("http://localhost:5173"),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.string(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_FROM: z.string(),

  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GEMINI_API_KEY:z.string(),
  RAZORPAY_KEY_ID:z.string(),
RAZORPAY_KEY_SECRET:z.string(),

});

/* ================= Validation ================= */

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ ENV VALIDATION ERROR");
  console.error(parsed.error.format());
  process.exit(1);
}

/* ================= Export ================= */

export const env = parsed.data;

