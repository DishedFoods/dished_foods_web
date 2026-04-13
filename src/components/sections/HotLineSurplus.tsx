"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

/**
 * HotLineSurplus — distinct "urgent" alert card that advertises the Hot Line
 * (end-of-day surplus from local chefs). Visual language is intentionally
 * louder than the rest of the page:
 *
 *   • ember-red hairline border + pulsing dot
 *   • dark warm-black surface with diagonal hatch pattern
 *   • high-contrast gold typography
 *
 * Interactive: hovering the card previews the `hotline` theme so the whole
 * surrounding palette shifts into urgent mode. Click a CTA to persist it.
 */
export function HotLineSurplus({
  label = "Hot Line",
  headline = "Surplus portions, going now.",
  body = "Nearby chefs just wrapped a cook. What's left is discounted and live on the Hot Line — tap through before it's gone.",
  cta = "Open the Hot Line",
  href = "/feed?tab=hotline",
}: {
  label?: string;
  headline?: string;
  body?: string;
  cta?: string;
  href?: string;
}) {
  const { previewTheme, setTheme } = useTheme();
  const { isCook, user } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24 px-5 md:px-10">
      <div
        ref={ref}
        onMouseEnter={() => previewTheme("hotline")}
        onMouseLeave={() => previewTheme(null)}
        className={`surplus-alert max-w-[1080px] mx-auto px-6 py-8 md:px-12 md:py-14
                    reveal-up ${visible ? "is-visible" : ""}`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
          {/* Left — live indicator + eyebrow */}
          <div className="flex-shrink-0 flex md:flex-col items-start gap-4 md:gap-3">
            <div className="flex items-center gap-3">
              <span className="surplus-dot" aria-hidden="true" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#e6c89a]">
                Live
              </span>
            </div>
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full
                         text-[10px] font-bold tracking-[0.20em] uppercase
                         text-[#120f0a] bg-[#e6c89a]
                         border border-[rgba(230,200,154,0.8)]
                         shadow-[0_6px_18px_-6px_rgba(230,200,154,0.5)]"
            >
              {label}
            </span>
          </div>

          {/* Middle — headline + body */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-serif mb-3"
              style={{
                color: "#fbf8f1",
                fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                fontWeight: 800,
              }}
            >
              {headline}
            </h3>
            <p className="text-[14.5px] md:text-[15px] leading-relaxed text-[rgba(251,248,241,0.78)] max-w-[560px]">
              {body}
            </p>
          </div>

          {/* Right — CTA */}
          <div className="flex-shrink-0">
            <a
              href={isCook ? href : "#"}
              onClick={(e) => {
                if (!user || !isCook) {
                  e.preventDefault();
                  router.push("/auth/cook?view=login");
                  return;
                }
                setTheme("hotline");
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full
                         text-[13px] font-bold tracking-[0.12em] uppercase
                         text-[#120f0a] bg-gradient-to-b from-[#f0dcb1] to-[#e6c89a]
                         border border-[rgba(230,200,154,0.8)]
                         shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_16px_36px_-10px_rgba(230,200,154,0.45)]
                         hover:-translate-y-0.5 transition-transform duration-200"
            >
              {cta}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
