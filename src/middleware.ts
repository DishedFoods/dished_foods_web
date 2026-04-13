import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Edge Middleware
 *
 * Responsibilities:
 * 1. Redirect unauthenticated users away from protected routes.
 * 2. Redirect already-authenticated users away from auth pages.
 * 3. Add an extra security header layer (belt-and-suspenders on top of
 *    next.config.js headers).
 *
 * NOTE: This is a defence-in-depth measure for the client-side session stored
 * in localStorage. Because Edge Middleware cannot read localStorage, we use a
 * lightweight, non-sensitive "presence" cookie (`dished_session`) that the
 * AuthProvider writes on login and clears on logout. The cookie carries NO
 * sensitive data — it is simply a boolean presence signal for the middleware.
 *
 * True authorisation (role checks, token validation) must happen on the
 * backend API for every privileged request.
 */

const SESSION_COOKIE = "dished_session";
const ADMIN_SESSION_COOKIE = "dished_admin_session";

// Routes that require any authenticated session
const PROTECTED_PREFIXES = ["/chef", "/feed"];

// Routes that require admin session
const PROTECTED_ADMIN_PREFIX = "/admin/dashboard";

// Auth pages that logged-in users should be bounced away from
const AUTH_PAGES = ["/become-a-chef", "/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.has(SESSION_COOKIE);
  const hasAdminSession = request.cookies.has(ADMIN_SESSION_COOKIE);

  // ── Redirect authenticated users away from auth pages ──────────────────
  if (AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    if (pathname.startsWith("/admin/login") && hasAdminSession) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (pathname === "/become-a-chef" && hasSession) {
      return NextResponse.redirect(new URL("/chef/dashboard", request.url));
    }
  }

  // ── Protect admin routes ────────────────────────────────────────────────
  if (pathname.startsWith(PROTECTED_ADMIN_PREFIX)) {
    if (!hasAdminSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Protect authenticated routes (chef portal + feed) ────────────────
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!hasSession) {
      const loginUrl = new URL("/auth/cook?view=login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Pass through with extra security headers ────────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon, public assets
     * - api routes (handled by backend proxy)
     */
    "/((?!_next/static|_next/image|favicon|public|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|css|js)).*)",
  ],
};
