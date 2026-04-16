import { NextRequest, NextResponse } from "next/server";
import { generateResetToken } from "@/lib/resetToken";
import { sendPasswordResetEmail } from "@/lib/mailer";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const isDev = process.env.NODE_ENV === "development";

/**
 * POST /api/auth/forgot-password
 *
 * Accepts { email } and:
 *  1. Fetches all cooks from the Go backend and finds the matching account.
 *  2. Generates a signed, time-limited reset token.
 *  3. Sends a reset email via SMTP (or logs to console in dev).
 *
 * Always returns a 200 with a generic message to prevent email enumeration
 * (an attacker can't tell whether the email exists or not).
 *
 * In development mode, the reset URL is also returned in the response body
 * so it can be copied directly from the browser's network tab.
 */
export async function POST(request: NextRequest) {
  const GENERIC_OK = {
    message:
      "If that email is registered, you'll receive a reset link shortly.",
  };

  try {
    const body = await request.json().catch(() => null) as { email?: unknown } | null;
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // ── Find the cook by email ─────────────────────────────────────────────
    // Called server-side so it's an internal backend call — not exposed to clients.
    let cookId: number | null = null;
    try {
      const res = await fetch(`${BACKEND_URL}/chefs`);
      if (res.ok) {
        const cooks = await res.json() as Array<{ id: number; email: string }>;
        const match = cooks.find(
          (c) => c.email.toLowerCase() === email
        );
        cookId = match?.id ?? null;
      }
    } catch {
      // Backend unreachable — silently return generic response
      return NextResponse.json(GENERIC_OK);
    }

    if (!cookId) {
      // Email not found — return generic response to prevent enumeration
      return NextResponse.json(GENERIC_OK);
    }

    // ── Generate signed token ──────────────────────────────────────────────
    let token: string;
    try {
      token = generateResetToken(cookId);
    } catch {
      // RESET_TOKEN_SECRET not configured
      return NextResponse.json(
        { error: "Password reset is not configured on this server." },
        { status: 503 }
      );
    }

    const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

    // ── Send email ─────────────────────────────────────────────────────────
    try {
      await sendPasswordResetEmail({ to: email, resetUrl });
    } catch (mailErr) {
      console.error("[forgot-password] Failed to send email:", mailErr);
      // Don't expose mailer errors to the client
      return NextResponse.json(GENERIC_OK);
    }

    // In dev, also include the URL in the response so it's testable without SMTP
    if (isDev) {
      return NextResponse.json({ ...GENERIC_OK, _devResetUrl: resetUrl });
    }

    return NextResponse.json(GENERIC_OK);
  } catch (err) {
    console.error("[/api/auth/forgot-password]", err);
    return NextResponse.json(GENERIC_OK);
  }
}
