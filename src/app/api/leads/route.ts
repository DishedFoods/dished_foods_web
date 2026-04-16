import { type NextRequest, NextResponse } from "next/server";

/**
 * POST /api/leads — legacy endpoint, forwards to /api/waitlist (AWS).
 * Kept for backwards compatibility.
 */

export const dynamic = "force-dynamic";

const AWS_BASE = process.env.AWS_BACKEND_BASE_URL;

/* Map frontend role values to AWS-accepted values */
const ROLE_MAP: Record<string, string> = {
  foodie: "user",
  cook: "chef",
  delivery: "driver",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as Record<string, unknown> | null;

    const firstName  = typeof body?.first_name === "string" ? body.first_name.trim()        : "";
    const lastName   = typeof body?.last_name  === "string" ? body.last_name.trim()         : "";
    const email      = typeof body?.email      === "string" ? body.email.trim().toLowerCase() : "";
    const phone      = typeof body?.phone      === "string" ? body.phone.trim()             : "";
    const city       = typeof body?.city       === "string" ? body.city.trim()              : "";
    const role       = typeof body?.role       === "string" ? body.role.trim()              : "foodie";
    const excitement = typeof body?.excitement === "string" ? body.excitement.trim()        : "";

    if (!firstName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

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
        message: excitement,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error("[/api/leads]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
