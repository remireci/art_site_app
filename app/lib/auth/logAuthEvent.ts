import { createAuthLog } from "@/db/mongo";

type LogType =
  | "invite_requested"
  | "invite_token_check"
  | "code_sent"
  | "code_verified"
  | "login_failed"
  | "rate_limited";

export async function logAuthEvent({
  email,
  ip,
  userAgent,
  type,
  success,
  metadata = {},
}: {
  email: string;
  ip?: string;
  userAgent?: string;
  type: LogType;
  success?: boolean;
  error?: string;
  metadata?: Record<string, any>;
  timestamp?: number;
}) {
  const log = {
    email,
    ip,
    userAgent,
    type,
    success: success ?? null,
    metadata,
    timestamp: new Date(),
  };
  await createAuthLog(log);
}
