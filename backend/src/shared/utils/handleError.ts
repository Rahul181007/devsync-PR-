import { Response } from "express";
import { logger } from "../logger/logger";
import { AppError } from "../errors/AppError";
import { ZodError } from "zod";

export function handleError(
  error: unknown,
  res: Response,
  defaultStatus = 500,
  defaultMessage = "Internal server error"
) {
  logger.error(defaultMessage, error);

  // ✅ ZOD VALIDATION ERRORS
  if (error instanceof ZodError) {
    const message = error.issues.map(e => e.message).join(", ");
    return res.status(400).json({
      error: message
    });
  }

  // ✅ DOMAIN / APPLICATION ERRORS
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  // ✅ GENERIC ERRORS
  if (error instanceof Error) {
    return res.status(defaultStatus).json({
      error: error.message
    });
  }

  return res.status(defaultStatus).json({
    error: defaultMessage
  });
}
