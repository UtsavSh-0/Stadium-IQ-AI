/**
 * Base class for all application-level (operational) errors.
 *
 * Operational errors are expected failure modes (bad input, missing
 * resource, unauthorized access, etc.) that should be surfaced to the
 * client with a clean message and the correct HTTP status code — as
 * opposed to programmer errors/bugs, which should crash loudly in dev
 * and be logged as unexpected in production.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
