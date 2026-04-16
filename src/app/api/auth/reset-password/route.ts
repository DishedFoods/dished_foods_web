import { NextRequest, NextResponse } from "next/server";
import { verifyResetToken } from "@/lib/resetToken";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

/**
 * POST /api/auth/reset-password
 *
 * Accepts { token, password } and:
 *  1. Verifies the HMAC-signed token (expiry + integrity check).
 *  2. Validates the new password against the same rules as registration.
 *  3. Sends a PUT /chefs/:id request to the Go backend with the new password.
 *
 * NOTE: Requires the Go backend to accept { password } on PUT /chefs/:id.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      token?: unknown;
      password?: unknown;
    } | null;

    const token = typeof body?.token === "string" ? body.token.trim() : null;
    const password = typeof body?.password === "string" ? body.password : null;

    if (!token) {
      return NextResponse.json(
        { error: "Reset token is required." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "New password is required." },
        { status: 400 }
      );
    }

    // ── Server-side password validation (mirrors client-side rules) ────────
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 422 }
      );
    }
    const letters = (password.match(/[a-zA-Z]/g) ?? []).length;
    if (letters < 6) {
      return NextResponse.json(
        { error: "Password must contain at least 6 letters." },
        { status: 422 }
      );
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least 1 number." },
        { status: 422 }
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least 1 special character (!@#$%^&*...).' },
        { status: 422 }
      );
    }

    // ── Verify token ───────────────────────────────────────────────────────
    let cookId: number;
    try {
      ({ cookId } = verifyResetToken(token));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid reset link.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // ── Update password on Go backend ──────────────────────────────────────
    const backendRes = await fetch(`${BACKEND_URL}/chefs/${cookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!backendRes.ok) {
      const errData = await backendRes.json().catch(() => null) as
        | { error?: string; message?: string }
        | null;
      return NextResponse.json(
        {
          error:
            errData?.error ||
            errData?.message ||
            "Failed to update password. Please try again.",
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("[/api/auth/reset-password]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
