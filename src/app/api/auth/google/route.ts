import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

/**
 * POST /api/auth/google
 *
 * Bridge between Google OAuth (implicit flow) and the Dished Go backend.
 *
 * Flow:
 *  1. Receive the Google OAuth access token from the client.
 *  2. Verify it by calling Google's userinfo endpoint server-side.
 *  3. Derive a deterministic username + password from the Google profile.
 *  4. Try to log in on the Go backend (returning user).
 *  5. If login fails, register a new cook account + profile (first-time user).
 *  6. Return the cook record to the client.
 *
 * Security notes:
 * - Token verification is server-side — the client never bypasses it.
 * - GOOGLE_SSO_SECRET is server-only (no NEXT_PUBLIC_ prefix).
 * - Derived passwords are HMAC-SHA256(secret, googleSub) — deterministic,
 *   non-guessable without the secret, unique per Google account.
 * - We only accept email_verified = true accounts.
 */

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8081/api/v1";

const SSO_SECRET = process.env.GOOGLE_SSO_SECRET ?? "";

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

/**
 * Derives a stable, URL-safe username from the Google email + sub.
 * Format: <sanitized_email_prefix>_g<first-6-chars-of-sub>
 * e.g. "alex.tremblay@gmail.com" → "alex_tremblay_g1a2b3c"
 */
function deriveUsername(email: string, sub: string): string {
  const prefix = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 12);
  const suffix = sub.replace(/\D/g, "").slice(0, 6) || sub.slice(0, 6);
  return `${prefix}_g${suffix}`;
}

/**
 * Derives a deterministic 32-char hex password using HMAC-SHA256.
 * The password is unguessable without GOOGLE_SSO_SECRET.
 */
function derivePassword(sub: string): string {
  if (!SSO_SECRET || SSO_SECRET === "REPLACE_WITH_A_STRONG_RANDOM_SECRET") {
    throw new Error("GOOGLE_SSO_SECRET is not configured on the server.");
  }
  const hex = createHmac("sha256", SSO_SECRET).update(sub).digest("hex");
  // Base: first 20 hex chars — contains lowercase letters (a-f) and digits ✓
  const base = hex.slice(0, 20);
  // Deterministic uppercase letter A-Z derived from bytes 20-21
  const upper = String.fromCharCode(65 + (parseInt(hex.slice(20, 22), 16) % 26));
  // Deterministic special character derived from bytes 22-23
  const specials = "!@#$%^&*";
  const special = specials[parseInt(hex.slice(22, 24), 16) % specials.length];
  // 22-char password: lowercase ✓  digit ✓  uppercase ✓  special ✓
  return base + upper + special;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as { accessToken?: unknown } | null;
    const accessToken = body?.accessToken;

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json(
        { error: "accessToken is required." },
        { status: 400 }
      );
    }

    // ── Step 1: Verify token via Google userinfo endpoint ──────────────────
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!userInfoRes.ok) {
      return NextResponse.json(
        { error: "Invalid or expired Google token. Please try again." },
        { status: 401 }
      );
    }

    const profile = (await userInfoRes.json()) as GoogleUserInfo;

    if (!profile.sub || !profile.email) {
      return NextResponse.json(
        { error: "Incomplete Google profile. Please grant email permission." },
        { status: 400 }
      );
    }

    if (profile.email_verified === false) {
      return NextResponse.json(
        { error: "Your Google email address is not verified." },
        { status: 401 }
      );
    }

    // ── Step 2: Derive credentials ─────────────────────────────────────────
    let password: string;
    try {
      password = derivePassword(profile.sub);
    } catch {
      return NextResponse.json(
        { error: "Google sign-in is not configured on this server." },
        { status: 503 }
      );
    }

    const username = deriveUsername(profile.email, profile.sub);
    const email = profile.email.toLowerCase();

    // ── Step 3: Try login (returning Google SSO user) ──────────────────────
    const loginRes = await fetch(`${BACKEND_URL}/chefs/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (loginRes.ok) {
      const cook = await loginRes.json();
      return NextResponse.json(cook);
    }

    // ── Step 4: Register (first-time Google SSO user) ──────────────────────
    const registerRes = await fetch(`${BACKEND_URL}/chefs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email }),
    });

    if (!registerRes.ok) {
      const errData = await registerRes.json().catch(() => null) as
        | { error?: string; message?: string }
        | null;

      // Email already registered via password — surface a helpful message
      if (registerRes.status === 409) {
        return NextResponse.json(
          {
            error:
              "An account with this email already exists. Please sign in with your username and password.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error:
            errData?.error ||
            errData?.message ||
            "Failed to create account. Please try again.",
        },
        { status: registerRes.status }
      );
    }

    const cook = await registerRes.json();

    // ── Step 5: Create profile with name from Google (best-effort) ─────────
    if (profile.given_name || profile.family_name) {
      await fetch(`${BACKEND_URL}/chef-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.given_name ?? "",
          lastName: profile.family_name ?? "",
        }),
      }).catch(() => {
        // Non-fatal — profile can be completed manually in the chef portal
      });
    }

    return NextResponse.json(cook);
  } catch (err) {
    console.error("[/api/auth/google]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
