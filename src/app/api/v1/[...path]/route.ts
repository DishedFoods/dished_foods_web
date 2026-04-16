/**
 * Runtime proxy for /api/v1/* → Go backend.
 *
 * BACKEND_URL is read inside the handler (not at module level) so Next.js
 * cannot inline it at build time. Docker runtime env vars are picked up on
 * every request.
 */

import { type NextRequest, NextResponse } from "next/server";

// Force this route to always run on the server at request time (never statically prerendered)
export const dynamic = "force-dynamic";

function getBackend(): string {
  const url =
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8081/api/v1";
  return url.replace(/\/+$/, "");
}

async function proxy(
  req: NextRequest,
  params: { path: string[] },
): Promise<NextResponse> {
  const backend = getBackend();
  const path = params.path.join("/");
  const search = req.nextUrl.search ?? "";
  const url = `${backend}/${path}${search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("x-forwarded-for");
  headers.delete("x-forwarded-host");
  headers.delete("x-forwarded-proto");

  const isBodyMethod = !["GET", "HEAD"].includes(req.method.toUpperCase());

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers,
      body: isBodyMethod ? req.body : undefined,
      signal: AbortSignal.timeout(10_000),
      ...(isBodyMethod ? { duplex: "half" } as Record<string, unknown> : {}),
    });

    const body = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ?? "application/json";

    return new NextResponse(body, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error(`[proxy] ${isTimeout ? "timed out" : "failed"} reaching ${url}:`, err);
    return NextResponse.json(
      { error: isTimeout ? "Request timed out. Please try again." : "Backend unavailable. Please try again later." },
      { status: isTimeout ? 504 : 502 },
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return proxy(req, params);
}
