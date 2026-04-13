"use client";

import { useEffect, useRef, useState } from "react";
import type { StoryContent } from "./storyContent";

/**
 * StoryHeader — editorial narrative block for the /how-it-works/[role] pages.
 *
 * Layout:
 *   [ eyebrow (ROLE · MISSION) ]
 *   [ large serif pull-quote — "Your passion deserves a stage." ]
 *   [ supporting line — "We removed the rent wall." (italic) ]
 *   [ utility chip row — Flexible hours · Zero overhead · Hot Line surplus · Reputation builder ]
 *
 * Uses IntersectionObserver for scroll-reveal: the whole block fades/slides
 * up, with children staggered via `.reveal-stagger` in globals.css.
 *
 * Per-role content lives in `./storyContent.ts` so server components can
 * import `STORY_BY_ROLE` without crossing the React Server Components
 * client-module boundary.
 */

export function StoryHeader({ content }: { content: StoryContent }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    /* Respect prefers-reduced-motion — skip straight to visible state. */
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "-40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative py-20 md:py-28 px-5 md:px-10 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient glow pulled from active theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        style={{ background: "var(--theme-glow, none)" }}
      />

      <div
        ref={rootRef}
        className={`reveal-up reveal-stagger max-w-[920px] mx-auto ${visible ? "is-visible" : ""}`}
      >
        {/* Eyebrow */}
        <div className="reveal-up eyebrow mb-6 justify-start" style={{ justifyContent: "flex-start" }}>
          {content.eyebrow}
        </div>

        {/* Mission — large editorial pull-quote */}
        <blockquote className="reveal-up">
          <p
            className="font-serif mb-5"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              fontWeight: 800,
            }}
          >
            {content.mission}
          </p>
          {content.missionTail && (
            <p
              className="font-serif italic max-w-[640px]"
              style={{
                color: "var(--accent, #b8895a)",
                fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)",
                lineHeight: 1.3,
                fontWeight: 500,
              }}
            >
              <span aria-hidden="true" className="pr-2 opacity-60">—</span>
              {content.missionTail}
            </p>
          )}
        </blockquote>

        {/* Gold hairline */}
        <div
          aria-hidden="true"
          className="reveal-up my-10 h-px max-w-[360px]"
          style={{
            background:
              "linear-gradient(90deg, var(--accent, #b8895a) 0%, transparent 100%)",
          }}
        />

        {/* Utility chips */}
        <div className="reveal-up flex flex-wrap gap-2.5 md:gap-3">
          {content.utilities.map((u) => (
            <span
              key={u}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                         text-[12px] md:text-[13px] font-semibold tracking-[0.08em] uppercase
                         backdrop-blur-sm"
              style={{
                color: "var(--text-primary)",
                background: "var(--surface-2, rgba(251,248,241,0.6))",
                border: "1px solid var(--hairline)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.45), 0 10px 24px -14px rgba(15,28,26,0.25)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--accent, #b8895a)" }}
              />
              {u}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
