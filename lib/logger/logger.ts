/**
 * Minimal structured logger.
 *
 * Wraps console methods behind a single interface so log output is
 * consistent (level, timestamp, context) and can later be swapped for a
 * provider (Pino, Winston, Datadog, etc.) without touching call sites.
 *
 * Reads NODE_ENV / LOG_LEVEL from process.env directly (not config/env)
 * so it stays importable from any context without pulling in the
 * server-only env module.
 *
 * Logging policy: never log secrets, session tokens, passwords, or raw
 * user message content — log identifiers and metadata instead.
 */
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const isProduction = process.env.NODE_ENV === "production";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function minLevel(): LogLevel {
  const configured = process.env.LOG_LEVEL as LogLevel | undefined;
  if (configured && configured in LEVEL_ORDER) {
    return configured;
  }
  return isProduction ? "info" : "debug";
}

function isEnabled(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minLevel()];
}

function format(level: LogLevel, message: string, context?: LogContext) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  };
}

function write(level: LogLevel, message: string, context?: LogContext) {
  if (!isEnabled(level)) {
    return;
  }

  const payload = format(level, message, context);
  const method = level === "debug" ? "log" : level;

  // In production, emit structured JSON (easy to ingest by log platforms).
  // In development, pretty-print for readability.
  if (isProduction) {
    console[method](JSON.stringify(payload));
  } else {
    console[method](`[${payload.timestamp}] ${level.toUpperCase()}: ${message}`, context ?? "");
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => write("debug", message, context),
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
};
