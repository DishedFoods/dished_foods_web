"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const DishedLoader = dynamic(
  () => import("@/components/ui/DishedLoader").then((m) => m.DishedLoader),
  { ssr: false },
);

/**
 * RouteTransitionProvider — shows the branded DishedLoader fullscreen overlay
 * on every internal App Router navigation.
 *
 * How it works (App Router — no router.events):
 *   1. A capture-phase click listener watches for <a> tags whose href is
 *      an internal path (not external, not hash-only, not target="_blank").
 *   2. On qualifying click -> isTransitioning = true -> overlay appears.
 *   3. usePathname() fires when the new route renders -> clear overlay.
 *   4. A safety timeout clears the overlay after 5s in case pathname never
 *      changes (e.g. same-page link, soft 404).
 */

interface TransitionCtx {
  isTransitioning: boolean;
  startTransition: () => void;
}

const Ctx = createContext<TransitionCtx>({
  isTransitioning: false,
  startTransition: () => undefined,
});

export const useRouteTransition = () => useContext(Ctx);

const SAFETY_MS = 5000;

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsTransitioning(false), SAFETY_MS);
  }, []);

  /* Clear overlay when pathname actually changes. */
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsTransitioning(false);
      if (timer.current) clearTimeout(timer.current);
    }
  }, [pathname]);

  /* Intercept clicks on internal <a> tags (captures Next <Link> too). */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      /* Skip external, hash-only, new-tab, download, or mailto links. */
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href === "#" ||
        (href.startsWith("#") && !href.startsWith("#/"))
      ) {
        return;
      }

      /* Skip if already on this path (avoid loader flash on same-page). */
      if (href === pathname || href === pathname + "/") return;

      startTransition();
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname, startTransition]);

  return (
    <Ctx.Provider value={{ isTransitioning, startTransition }}>
      {children}

      {mounted && isTransitioning && (
        <div
          key="route-loader"
          className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in"
          style={{ background: "var(--bg, #F9F8F3)" }}
        >
          <DishedLoader size="lg" />
        </div>
      )}
    </Ctx.Provider>
  );
}
