/**
 * Stateless, HMAC-signed password-reset token utilities.
 *
 * Token format (dot-separated, each segment base64url-encoded):
 *   <cookId>.<expiryMs>.<hmac>
 *
 * where hmac = HMAC-SHA256(RESET_TOKEN_SECRET, "<cookId>:<expiryMs>")
 *
 * Tokens expire after EXPIRY_MS (1 hour by default).
 * No database storage required — all state is in the signed token itself.
 */

import { createHmac, timingSafeEqual } from "crypto";

const RESET_SECRET = process.env.RESET_TOKEN_SECRET ?? "";
const EXPIRY_MS = 60 * 60 * 1000; // 1 hour

function b64url(s: string): string {
  return Buffer.from(s).toString("base64url");
}

function fromB64url(s: string): string {
  return Buffer.from(s, "base64url").toString("utf8");
}

function sign(cookId: number, expiry: number): string {
  return createHmac("sha256", RESET_SECRET)
    .update(`${cookId}:${expiry}`)
    .digest("base64url");
}

/** Generate a signed reset token valid for 1 hour. */
export function generateResetToken(cookId: number): string {
  if (!RESET_SECRET || RESET_SECRET === "REPLACE_WITH_A_STRONG_RANDOM_SECRET") {
    throw new Error("RESET_TOKEN_SECRET is not configured.");
  }
  const expiry = Date.now() + EXPIRY_MS;
  const hmac = sign(cookId, expiry);
  return `${b64url(String(cookId))}.${b64url(String(expiry))}.${hmac}`;
}

export interface VerifiedToken {
  cookId: number;
}

/**
 * Verify a reset token.
 * Returns the cookId if valid, throws with a user-safe message otherwise.
 */
export function verifyResetToken(token: string): VerifiedToken {
  if (!RESET_SECRET || RESET_SECRET === "REPLACE_WITH_A_STRONG_RANDOM_SECRET") {
    throw new Error("Password reset is not configured on this server.");
  }

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid reset link.");

  let cookId: number;
  let expiry: number;

  try {
    cookId = parseInt(fromB64url(parts[0]), 10);
    expiry = parseInt(fromB64url(parts[1]), 10);
  } catch {
    throw new Error("Invalid reset link.");
  }

  if (!Number.isFinite(cookId) || !Number.isFinite(expiry)) {
    throw new Error("Invalid reset link.");
  }

  // Timing-safe HMAC comparison to prevent timing attacks
  const expected = sign(cookId, expiry);
  const actual = parts[2];
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(actual);

  if (
    expectedBuf.length !== actualBuf.length ||
    !timingSafeEqual(expectedBuf, actualBuf)
  ) {
    throw new Error("Invalid reset link. It may have been tampered with.");
  }

  if (Date.now() > expiry) {
    throw new Error("This reset link has expired. Please request a new one.");
  }

  return { cookId };
}
