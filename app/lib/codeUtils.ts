import crypto from "crypto";

export function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function verifyCode(inputCode: string, hashedCode: string): boolean {
  return hashCode(inputCode) === hashedCode;
}
