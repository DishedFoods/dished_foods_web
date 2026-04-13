import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * POST /api/auth/apple
 *
 * Bridge between Apple Sign In (implicit JS SDK flow) and the Dished Go backend.
 *
 * Flow:
 *  1. Receive Apple's id_token + optional user info from the client.
 *  2. Verify the id_token server-side against Apple's published JWKS.
 *  3. Derive deterministic username + password from the Apple `sub`.
 *  4. Try login on the Go backend (returning user).
 *  5. If login fails → register new cook + profile (first-time user).
 *  6. Return the cook record to the client.
 *
 * Security notes:
 * - id_token verification is server-side via Apple's JWKS endpoint.
 * - APPLE_SSO_SECRET is server-only (no NEXT_PUBLIC_ prefix).
 * - Apple only sends name/email on the VERY FIRST sign-in; after that the
 *   `user` field is absent. We persist the display name on first sign-in only.
 * - Apple may provide a relay email ("privaterelay.appleid.com") — we accept it.
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID ?? "";
const SSO_SECRET = process.env.APPLE_SSO_SECRET ?? "";

// Apple's JWKS — keys rotate infrequently; jose caches them automatically.
const AppleJWKS = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys")
);

interface AppleIdTokenPayload {
  sub: string;
  email?: string;
  email_verified?: boolean | string;
  iss: string;
  aud: string | string[];
  exp: number;
}

interface AppleUserName {
  firstName?: string;
  lastName?: string;
}

/**
 * Derives a stable, URL-safe username from the Apple sub.
 * Format: apple_<first-12-alphanumeric-chars-of-sub>
 * Apple subs look like "001234.abc...xyz.1234" — strip punctuation.
 */
function deriveUsername(sub: string): string {
  const clean = sub.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 12);
  return `apple_${clean}`;
}

/**
 * Derives a deterministic 32-char hex password from the Apple sub.
 * Unguessable without APPLE_SSO_SECRET.
 */
function derivePassword(sub: string): string {
  if (!SSO_SECRET || SSO_SECRET === "REPLACE_WITH_A_STRONG_RANDOM_SECRET") {
    throw new Error("APPLE_SSO_SECRET is not configured on the server.");
  }
  return createHmac("sha256", SSO_SECRET).update(sub).digest("hex").slice(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as {
      idToken?: unknown;
      user?: { name?: AppleUserName; email?: string } | null;
    } | null;

    const idToken = body?.idToken;
    const appleUser = body?.user ?? null;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "idToken is required." },
        { status: 400 }
      );
    }

    if (!APPLE_CLIENT_ID || APPLE_CLIENT_ID === "YOUR_APPLE_SERVICES_ID_HERE") {
      return NextResponse.json(
        { error: "Apple sign-in is not configured on this server." },
        { status: 503 }
      );
    }

    // ── Step 1: Verify id_token with Apple's JWKS ──────────────────────────
    let payload: AppleIdTokenPayload;
    try {
      const { payload: verified } = await jwtVerify(idToken, AppleJWKS, {
        issuer: "https://appleid.apple.com",
        audience: APPLE_CLIENT_ID,
      });
      payload = verified as AppleIdTokenPayload;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired Apple token. Please try signing in again." },
        { status: 401 }
      );
    }

    const { sub, email } = payload;

    if (!sub) {
      return NextResponse.json(
        { error: "Incomplete Apple token. Missing user identifier." },
        { status: 400 }
      );
    }

    // email_verified can be a boolean or the string "true"
    const emailVerified =
      payload.email_verified === true || payload.email_verified === "true";

    // Apple relay emails (privaterelay.appleid.com) are always considered verified
    const isRelayEmail = email?.endsWith("@privaterelay.appleid.com") ?? false;

    if (email && !emailVerified && !isRelayEmail) {
      return NextResponse.json(
        { error: "Your Apple ID email address is not verified." },
        { status: 401 }
      );
    }

    // ── Step 2: Derive credentials ─────────────────────────────────────────
    let password: string;
    try {
      password = derivePassword(sub);
    } catch {
      return NextResponse.json(
        { error: "Apple sign-in is not configured on this server." },
        { status: 503 }
      );
    }

    const username = deriveUsername(sub);
    // Fall back to a generated email if Apple did not provide one (shouldn't
    // happen but guards against edge cases with old SDK versions).
    const cookEmail = email ?? `${username}@privaterelay.appleid.com`;

    // ── Step 3: Try login (returning Apple SSO user) ───────────────────────
    const loginRes = await fetch(`${BACKEND_URL}/chefs/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (loginRes.ok) {
      const cook = await loginRes.json();
      return NextResponse.json(cook);
    }

    // ── Step 4: Register (first-time Apple SSO user) ───────────────────────
    const registerRes = await fetch(`${BACKEND_URL}/chefs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email: cookEmail }),
    });

    if (!registerRes.ok) {
      const errData = await registerRes.json().catch(() => null) as
        | { error?: string; message?: string }
        | null;

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

    // ── Step 5: Create profile (name only available on first Apple sign-in) ─
    const firstName = appleUser?.name?.firstName ?? "";
    const lastName = appleUser?.name?.lastName ?? "";

    if (firstName || lastName) {
      await fetch(`${BACKEND_URL}/chef-profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      }).catch(() => {
        // Non-fatal — profile can be completed in the chef portal
      });
    }

    return NextResponse.json(cook);
  } catch (err) {
    console.error("[/api/auth/apple]", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
