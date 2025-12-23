import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 4000,
  MONGO_URL: process.env.MONGO_URL || "",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,

  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  FRONTEND_URL:process.env.FRONTEND_URL || "http://localhost:5173",

  Mail_HOST:process.env.MAIL_HOST,
  MAIL_PORT:process.env.MAIL_PORT,
  MAIL_USER:process.env.MAIL_USER,
  MAIL_PASS:process.env.MAIL_PASS,
  MAIL_FROM:process.env.MAIL_FROM,
};

