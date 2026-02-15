export type Severity = "info" | "log" | "warn" | "error";

export const SeveritySymbol = {
  info: "\u001b[34mi\u001b[0m",
  log: "\u001b[32m~\u001b[0m",
  warn: "\u001b[33m!\u001b[0m",
  error: "\u001b[31mx\u001b[0m",
} as const satisfies Record<Severity, string>;
