import { type NextRequest, NextResponse } from "next/server";

/**
 * Waitlist API proxy → AWS backend.
 *
 * POST /api/waitlist  — join the waitlist (proxied to AWS)
 * GET  /api/waitlist  — list all entries  (proxied to AWS)
 *
 * The AWS URL is kept server-side so it never leaks into the client bundle.
 * All client code calls /api/waitlist (same-origin).
 */

export const dynamic = "force-dynamic";

const AWS_BASE = "https://nx1qps0bqb.execute-api.us-east-2.amazonaws.com/api/v1";

/* Map frontend role values to AWS-accepted values */
const ROLE_MAP: Record<string, string> = {
  foodie: "user",
  cook: "chef",
  delivery: "driver",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const firstName  = typeof body.first_name === "string" ? body.first_name.trim()        : "";
    const lastName   = typeof body.last_name  === "string" ? body.last_name.trim()         : "";
    const email      = typeof body.email      === "string" ? body.email.trim().toLowerCase() : "";
    const phone      = typeof body.phone      === "string" ? body.phone.trim()             : "";
    const city       = typeof body.city       === "string" ? body.city.trim()              : "";
    const role       = typeof body.role       === "string" ? body.role.trim()              : "foodie";
    const excitement = typeof body.excitement === "string" ? body.excitement.trim()        : "";

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    /* Map role to AWS-accepted value (chef | user | driver) */
    const awsRole = ROLE_MAP[role] ?? "user";

    const upstream = await fetch(`${AWS_BASE}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        city,
        role: awsRole,
        message: excitement || undefined,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const data = await upstream.json().catch(() => ({}));

    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/waitlist POST]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out." : "Something went wrong." },
      { status: isTimeout ? 504 : 500 },
    );
  }
}

export async function GET() {
  try {
    const upstream = await fetch(`${AWS_BASE}/waitlist`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    const data = await upstream.json().catch(() => ({}));

    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[/api/waitlist GET]", err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out." : "Something went wrong." },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
