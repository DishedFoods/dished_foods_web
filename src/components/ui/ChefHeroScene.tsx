"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ── CSS variables from globals.css ──────────────────────────────
   --green-primary : #4d9e8a   (action badge background)
   --green-deeper  : #2a6155   (text on light badges)
   --green-lighter : #d6f0e9   (container + badge background)
   --green-border  : #7dcfc1   (badge border)
   --bg            : #f0faf8   (page background)
─────────────────────────────────────────────────────────────── */

export default function ChefHeroScene() {
  const [mounted,  setMounted]  = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced,  setReduced]  = useState(false);

  /* refs for direct DOM animation (no re-renders on scroll) */
  const containerRef   = useRef<HTMLDivElement>(null);
  const imgWrapRef     = useRef<HTMLDivElement>(null);
  const bgWrapRef      = useRef<HTMLDivElement>(null);
  const womanLayerRef  = useRef<HTMLDivElement>(null);
  const manLayerRef    = useRef<HTMLDivElement>(null);
  const bgWomanRef     = useRef<HTMLDivElement>(null);
  const bgManRef       = useRef<HTMLDivElement>(null);
  const actionBadgeRef = useRef<HTMLDivElement>(null);
  const showingManRef  = useRef(false);

  /* inject keyframes once */
  useEffect(() => {
    const id  = "chef-hero-kf";
    if (document.getElementById(id)) return;
    const el  = document.createElement("style");
    el.id     = id;
    el.textContent = `
      @keyframes steamRise {
        0%   { transform: translateY(0)      scaleX(1.0); opacity: 0.65; }
        100% { transform: translateY(-130px) scaleX(1.8); opacity: 0;    }
      }
      @keyframes floatBadge {
        0%, 100% { transform: translateY(0);    }
        50%       { transform: translateY(-8px); }
      }
      @keyframes floatBadgeMid {
        0%, 100% { transform: translateY(-50%);          }
        50%       { transform: translateY(calc(-50% - 8px)); }
      }
      @keyframes kenBurns {
        0%, 100% { transform: scale(1.00); }
        50%       { transform: scale(1.04); }
      }
      @keyframes heartFloat {
        0%   { transform: translateY(0)       scale(0);   opacity: 0; }
        18%  { transform: translateY(-18px)   scale(1.0); opacity: 1; }
        100% { transform: translateY(-110px)  scale(0.3); opacity: 0; }
      }
      @keyframes heroShimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }
    `;
    document.head.appendChild(el);
  }, []);

  /* mount + scroll listener */
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const red    = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsMobile(mobile);
    setReduced(red);
    setMounted(true);

    if (red) return;

    const onScroll = () => {
      const section = containerRef.current?.closest("section");
      const heroH   = section?.offsetHeight ?? window.innerHeight;
      const progress = window.scrollY / heroH;

      /* ── crossfade at 45% ── */
      const toMan = progress >= 0.45;
      if (toMan !== showingManRef.current) {
        showingManRef.current = toMan;

        if (womanLayerRef.current)  womanLayerRef.current.style.opacity  = toMan ? "0"   : "1";
        if (manLayerRef.current)    manLayerRef.current.style.opacity    = toMan ? "1"   : "0";
        if (bgWomanRef.current)     bgWomanRef.current.style.opacity     = toMan ? "0"   : "0.3";
        if (bgManRef.current)       bgManRef.current.style.opacity       = toMan ? "0.3" : "0";

        /* action badge: slide out, swap text, slide in */
        if (actionBadgeRef.current) {
          const el = actionBadgeRef.current;
          el.style.opacity   = "0";
          el.style.transform = "translateX(-50%) translateY(10px)";
          setTimeout(() => {
            if (!actionBadgeRef.current) return;
            el.textContent     = toMan ? "Tossing the perfect dish ♥" : "Stirring with love ♥";
            el.style.opacity   = "1";
            el.style.transform = "translateX(-50%) translateY(0)";
          }, 420);
        }
      }

      /* ── parallax (desktop only) ── */
      if (!mobile) {
        const py   = window.scrollY * 0.30;
        const bgPy = window.scrollY * 0.15;
        if (imgWrapRef.current) imgWrapRef.current.style.transform = `translateY(${py}px)`;
        if (bgWrapRef.current)  bgWrapRef.current.style.transform  = `translateY(${bgPy}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Loading skeleton ─────────────────────────────────── */
  if (!mounted) {
    return (
      <div style={{
        width: "100%", height: "clamp(320px, 42vw, 500px)",
        borderRadius: "24px", overflow: "hidden",
        background: "#d6f0e9", position: "relative",
        boxShadow: "0 20px 60px rgba(77,158,138,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.30) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "heroShimmer 1.8s linear infinite",
        }} />
        {/* chef-hat icon */}
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none"
             stroke="#7dcfc1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 19h12M3 9a3 3 0 0 1 3-3 5 5 0 0 1 10 0 3 3 0 0 1 3 3v1H3V9z"/>
          <rect x="6" y="13" width="12" height="6" rx="1"/>
        </svg>
      </div>
    );
  }

  const steamCount = isMobile ? 2 : 4;
  const heartCount = isMobile ? 3 : 6;

  /* ── Scene ──────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", width: "100%",
        height: "clamp(320px, 42vw, 500px)",
        borderRadius: "24px", overflow: "hidden",
        background: "#d6f0e9",
        boxShadow: "0 24px 64px rgba(77,158,138,0.20), 0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Layer 1: Background blur ───────────────────── */}
      <div ref={bgWrapRef} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <div ref={bgWomanRef}
          style={{ position: "absolute", inset: 0, opacity: 0.3,
                   transition: "opacity 0.8s ease-in-out" }}>
          <Image src="/images/chef-woman.jpg" fill alt="" aria-hidden sizes="50vw"
            style={{ objectFit: "cover", filter: "blur(8px)",
                     transform: "scale(1.15)", transformOrigin: "center" }} />
        </div>
        <div ref={bgManRef}
          style={{ position: "absolute", inset: 0, opacity: 0,
                   transition: "opacity 0.8s ease-in-out" }}>
          <Image src="/images/chef-man.jpg" fill alt="" aria-hidden sizes="50vw"
            style={{ objectFit: "cover", filter: "blur(8px)",
                     transform: "scale(1.15)", transformOrigin: "center" }} />
        </div>
      </div>

      {/* ── Layer 2: Main chef images ──────────────────── */}
      <div ref={imgWrapRef} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        {/* Woman — visible by default */}
        <div ref={womanLayerRef}
          style={{ position: "absolute", inset: 0, opacity: 1,
                   transition: "opacity 0.8s ease-in-out" }}>
          <Image
            src="/images/chef-woman.jpg"
            fill priority
            alt="Home chef — woman cooking with love"
            sizes="50vw"
            style={{
              objectFit: "cover",
              animation: reduced ? undefined : "kenBurns 10s ease-in-out infinite",
            }}
          />
        </div>
        {/* Man — hidden by default */}
        <div ref={manLayerRef}
          style={{ position: "absolute", inset: 0, opacity: 0,
                   transition: "opacity 0.8s ease-in-out", zIndex: 1 }}>
          <Image
            src="/images/chef-man.jpg"
            fill
            alt="Home chef — man tossing a dish"
            sizes="50vw"
            style={{
              objectFit: "cover",
              animation: reduced ? undefined : "kenBurns 10s ease-in-out infinite 0.5s",
            }}
          />
        </div>
      </div>

      {/* ── Layer 3: Warm brand color grade ───────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        background: "linear-gradient(135deg,rgba(77,158,138,0.17) 0%,rgba(58,130,115,0.08) 50%,rgba(42,97,85,0.22) 100%)",
        mixBlendMode: "multiply",
      }} />

      {/* ── Layer 4: Animated overlays ─────────────────── */}
      {!reduced && (
        <>
          {/* Steam wisps */}
          {Array.from({ length: steamCount }, (_, i) => (
            <div key={`s${i}`}
              style={{
                position: "absolute", zIndex: 4, pointerEvents: "none",
                bottom: "76px",
                left: `calc(50% + ${(i - (steamCount - 1) / 2) * 18}px)`,
                width: "8px", height: "40px", borderRadius: "50%",
                background: "rgba(255,255,255,0.62)", filter: "blur(4px)",
                animation: "steamRise 2.5s ease-out infinite",
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}

          {/* Heart particles */}
          {Array.from({ length: heartCount }, (_, i) => (
            <div key={`h${i}`}
              style={{
                position: "absolute", zIndex: 4, pointerEvents: "none",
                bottom: "88px",
                left: `calc(50% + ${Math.sin(i * 1.05) * 58}px)`,
                animation: "heartFloat 3s ease-out infinite",
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6b9d">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
          ))}

          {/* Ingredient badge — top-left */}
          <div style={{
            position: "absolute", top: "20px", left: "16px", zIndex: 5,
            padding: "4px 13px", borderRadius: "999px",
            background: "rgba(214,240,233,0.92)", border: "1px solid #7dcfc1",
            fontSize: "13px", fontWeight: 500, color: "#2a6155",
            animation: "floatBadge 3.2s ease-in-out infinite", animationDelay: "0s",
          }}>
            ✦ Fresh
          </div>

          {/* Ingredient badge — mid-right */}
          <div style={{
            position: "absolute", top: "50%", right: "14px", zIndex: 5,
            padding: "4px 13px", borderRadius: "999px",
            background: "rgba(214,240,233,0.92)", border: "1px solid #7dcfc1",
            fontSize: "13px", fontWeight: 500, color: "#2a6155",
            animation: "floatBadgeMid 3.6s ease-in-out infinite", animationDelay: "1s",
          }}>
            ✦ Homemade
          </div>

          {/* Ingredient badge — bottom-left */}
          <div style={{
            position: "absolute", bottom: "62px", left: "16px", zIndex: 5,
            padding: "4px 13px", borderRadius: "999px",
            background: "rgba(214,240,233,0.92)", border: "1px solid #7dcfc1",
            fontSize: "13px", fontWeight: 500, color: "#2a6155",
            animation: "floatBadge 4s ease-in-out infinite", animationDelay: "2s",
          }}>
            ✦ Made with Love
          </div>

          {/* Cooking action badge — bottom-center */}
          <div
            ref={actionBadgeRef}
            style={{
              position: "absolute", bottom: "20px", left: "50%",
              transform: "translateX(-50%)",
              padding: "7px 20px", borderRadius: "999px",
              background: "#4d9e8a", color: "white",
              fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap",
              zIndex: 6,
              transition: "transform 0.4s ease, opacity 0.4s ease",
              opacity: 1,
            }}
          >
            Stirring with love ♥
          </div>
        </>
      )}

      {/* ── Layer 5: Edge vignette ─────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.36) 100%)",
      }} />
    </div>
  );
}
