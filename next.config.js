/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// Build a strict but functional Content Security Policy
const cspDirectives = [
  "default-src 'self'",
  // Next.js requires unsafe-inline for styles; unsafe-eval only in dev.
  // Google Identity Services (accounts.google.com/gsi/client) also needs
  // to be allowed as a script source for the OAuth popup flow.
  isDev
    ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com"
    : "script-src 'self' 'unsafe-inline' https://accounts.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://ui-avatars.com https://lh3.googleusercontent.com",
  // Allow blob: and data: for locally-uploaded video previews
  "media-src 'self' blob: data:",
  // Google OAuth API calls
  // All backend calls go through /api/v1/* (same-origin proxy) so no external connect-src needed for the API.
  "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
  // Google OAuth popups/iframes
  "frame-src https://accounts.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Prevent clickjacking — redundant with CSP frame-ancestors but belt-and-suspenders
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Restrict referrer information sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not needed by this app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Legacy XSS filter — belt-and-suspenders for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // DNS prefetch control — prevent leaking visited domains
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // HSTS — only effective over HTTPS; ignored on localhost
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: cspDirectives },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // No rewrites needed — /api/v1/* is handled by src/app/api/v1/[...path]/route.ts
  // which reads BACKEND_URL at request time (runtime), not at build time.
};

nextConfig.logging = {
  fetches: { fullUrl: false },
};

module.exports = nextConfig;