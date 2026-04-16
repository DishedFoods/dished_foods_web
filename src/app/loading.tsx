/**
 * Global App Router loading fallback.
 * Kept intentionally minimal — the RouteTransitionProvider handles the branded
 * animated loader on client-side navigations. This file covers the initial
 * server-side Suspense boundary (e.g. first paint before hydration).
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "var(--bg, #F9F8F3)" }}
    >
      <div
        className="w-12 h-12 rounded-full border-[3px] animate-spin"
        style={{
          borderColor: "var(--hairline, #e5e5e5)",
          borderTopColor: "var(--accent, #D4AF37)",
        }}
      />
    </div>
  );
}
