"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export interface StoryStep {
  /** SVG icon node shown beside the step title */
  icon: React.ReactNode;
  title: string;
  narration: string;
  /** Mock screen shown on the phone — unique per step */
  screen: React.ReactNode;
  /** Optional Unsplash background image for this step */
  bgImage?: string;
}

interface Props {
  accent: string;        // tailwind gradient stops e.g. "from-orange-500 to-red-600"
  accentSolid: string;   // hex/rgb used for progress bar & glow
  role: string;
  steps: StoryStep[];
  ctaLabel: string;
  ctaHref: string;
}

export function RoleStory({ accent, accentSolid, role, steps, ctaLabel, ctaHref }: Props) {
  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const isLast = idx === steps.length - 1;
  const phoneRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, visible: false });

  /* ── 3D tilt on phone mockup ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = phoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -8;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 8;
    setTilt({ x: rx, y: ry });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  /* ── Custom cursor glow ── */
  const handleSectionMouse = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }, []);

  const handleSectionLeave = useCallback(() => {
    setCursorPos((p) => ({ ...p, visible: false }));
  }, []);

  /* ── Auto-advance timer ── */
  useEffect(() => {
    if (isLast) return;
    const timer = setTimeout(() => setIdx((i) => i + 1), 8000);
    return () => clearTimeout(timer);
  }, [idx, isLast]);

  return (
    <section
      ref={sectionRef}
      className="relative px-5 pb-24 overflow-hidden"
      onMouseMove={handleSectionMouse}
      onMouseLeave={handleSectionLeave}
    >
      {/* ── Cursor glow effect ── */}
      {cursorPos.visible && (
        <div
          className="pointer-events-none fixed z-50 w-[340px] h-[340px] rounded-full
                     transition-opacity duration-300"
          style={{
            left: cursorPos.x - 170,
            top: cursorPos.y - 170,
            position: "absolute",
            background: `radial-gradient(circle, ${accentSolid}18 0%, transparent 70%)`,
            opacity: cursorPos.visible ? 1 : 0,
          }}
        />
      )}

      {/* ── Background hero image — changes per step ── */}
      {step.bgImage && (
        <div key={`bg-${idx}`} className="absolute inset-0 z-0 animate-[fadeIn_800ms_ease-out]">
          <Image
            src={step.bgImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={idx === 0}
          />
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "color-mix(in srgb, var(--bg, #f0faf8) 92%, transparent)" }} />
        </div>
      )}

      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* ── Step indicators ── */}
        <div className="flex items-center gap-3 mb-12 md:mb-16">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`group flex-1 relative cursor-pointer transition-all duration-300
                         ${i <= idx ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
              aria-label={`Step ${i + 1}: ${s.title}`}
            >
              {/* Track */}
              <div className="h-1.5 rounded-full bg-gray-200/80 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: i < idx ? "100%" : i === idx ? "100%" : "0%",
                    background: `linear-gradient(90deg, ${accentSolid}, ${accentSolid}cc)`,
                  }}
                />
              </div>
              {/* Label underneath on desktop */}
              <div className={`hidden md:block mt-2 text-[10px] font-bold uppercase tracking-wider
                              transition-colors duration-300
                              ${i <= idx ? "text-gray-700" : "text-gray-400"}`}>
                {s.title.split(" ").slice(0, 3).join(" ")}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* ── Left: phone mockup with 3D tilt ── */}
          <div className="flex justify-center order-2 md:order-1" style={{ perspective: "1200px" }}>
            <div
              ref={phoneRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-[280px] h-[560px] rounded-[44px] bg-gray-900 p-3
                         transition-transform duration-200 ease-out will-change-transform"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                boxShadow: `
                  0 40px 100px -20px ${accentSolid}40,
                  0 25px 50px rgba(0,0,0,0.2),
                  inset 0 1px 0 rgba(255,255,255,0.1)
                `,
              }}
            >
              {/* Dynamic Island notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[28px]
                              bg-gray-900 rounded-full z-20 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-800 ring-1 ring-gray-700" />
              </div>
              {/* Screen */}
              <div
                key={idx}
                className="relative w-full h-full rounded-[36px] bg-white overflow-hidden
                           animate-[fadeSlide_600ms_cubic-bezier(0.16,1,0.3,1)]"
              >
                {step.screen}
              </div>
              {/* Reflection shine */}
              <div className="absolute inset-0 rounded-[44px] pointer-events-none
                              bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            </div>

            {/* ── Decorative floating elements around phone ── */}
            <div className="absolute -z-10 hidden md:block">
              {/* Hand-drawn arrow */}
              <svg className="absolute -right-16 top-20 w-16 h-16 text-gray-300 animate-[float_4s_ease-in-out_infinite]"
                   viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M 10 50 Q 30 10 55 20" />
                <path d="M 48 14 L 55 20 L 46 24" />
              </svg>
            </div>
          </div>

          {/* ── Right: narrative card ── */}
          <div
            key={`narr-${idx}`}
            className="order-1 md:order-2 animate-[fadeSlide_600ms_cubic-bezier(0.16,1,0.3,1)]"
          >
            {/* Step badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5
                         border text-[11px] font-black tracking-[0.15em] uppercase"
              style={{
                borderColor: `${accentSolid}40`,
                background: `${accentSolid}0a`,
                color: accentSolid,
              }}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-black"
                    style={{ background: accentSolid }}>
                {idx + 1}
              </span>
              Step {idx + 1} of {steps.length}
            </div>

            {/* Step icon */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
                 style={{ background: `${accentSolid}12` }}>
              <div style={{ color: accentSolid }}>{step.icon}</div>
            </div>

            {/* Title */}
            <h2 className="font-serif font-black text-gray-900 leading-[1.08] mb-5"
                style={{ fontSize: "clamp(30px, 4vw, 46px)" }}>
              {step.title}
            </h2>

            {/* Narration */}
            <p className="text-gray-600 text-[17px] leading-[1.7] mb-8 max-w-[480px]">
              {step.narration}
            </p>

            {/* ── Navigation ── */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center
                           text-gray-500 hover:border-gray-400 hover:bg-white hover:shadow-md
                           transition-all duration-200
                           disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:shadow-none"
                aria-label="Previous step"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {!isLast ? (
                <button
                  onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
                  className={`group flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white
                             font-bold text-[15px] bg-gradient-to-r ${accent} shadow-lg
                             hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]
                             transition-all duration-200`}
                >
                  Next
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                       className="group-hover:translate-x-0.5 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              ) : (
                <Link
                  href={ctaHref}
                  className={`group flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white
                             font-bold text-[15px] bg-gradient-to-r ${accent} shadow-lg
                             hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]
                             transition-all duration-200`}
                >
                  {ctaLabel}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                       className="group-hover:translate-x-0.5 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-8px) rotate(3deg); }
        }
      `}</style>
    </section>
  );
}
