"use client";

/**
 * DishedLoader — branded pot → box sequence, orchestrated with Framer Motion.
 *
 *   Phase 1 (pot simmering) ─┐
 *                            ├─ cross-fade ──┐
 *   Phase 2 (box packing)  ──┘               │
 *                                            └── loop
 *
 * Framer Motion is used for:
 *   • Scene cross-fade (pot ↔ box) driven by AnimatePresence
 *   • Steam wisps with staggered ease-out floats
 *   • Bubble pulses inside the pot rim
 *   • Box flap rotation + portion drop
 *   • Fullscreen overlay fade in/out
 *
 * All colors pull from the active theme's CSS variables so the loader
 * automatically re-skins with Midnight Bistro, Alabaster Kitchen, and
 * Classic Dished palettes.
 */

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, number> = {
  sm: 56,
  md: 96,
  lg: 140,
  xl: 200,
};

/* Scene duration — each scene holds for ~1.8s before crossfading. */
const SCENE_MS = 1800;

/* Motion variants ------------------------------------------------------- */

const sceneVariants: Variants = {
  hidden:  { opacity: 0, y: 10, scale: 0.94, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0,  scale: 1,    filter: "blur(0px)" },
  exit:    { opacity: 0, y: -8, scale: 0.94, filter: "blur(6px)" },
};

const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
};

const steamVariants: Variants = {
  animate: (i: number) => ({
    y: [-2, -16],
    opacity: [0, 0.95, 0],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      delay: i * 0.28,
      ease: "easeOut",
    },
  }),
};

const bubbleVariants: Variants = {
  animate: (i: number) => ({
    y: [0, -1, 0],
    opacity: [0.55, 0.95, 0.55],
    transition: {
      duration: 1.1,
      repeat: Infinity,
      delay: i * 0.25,
      ease: "easeInOut",
    },
  }),
};

const flapVariants: Variants = {
  animate: {
    rotate: [-60, -60, -8, -8, -60],
    transition: {
      duration: 1.8,
      times: [0, 0.2, 0.45, 0.75, 1],
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const dropVariants: Variants = {
  animate: {
    y:       [-14, -14, 6, 4, 4],
    opacity: [0,    0,   1, 1, 1],
    transition: {
      duration: 1.8,
      times: [0, 0.3, 0.55, 0.7, 1],
      repeat: Infinity,
      ease: "easeIn",
    },
  },
};

/* Component ------------------------------------------------------------- */

export function DishedLoader({
  size = "md",
  label,
  fullscreen = false,
}: {
  size?: Size;
  label?: string;
  fullscreen?: boolean;
}) {
  const px = SIZE_MAP[size];

  /* Scene index — 0 = pot (simmering), 1 = box (packing). */
  const [scene, setScene] = useState<0 | 1>(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setScene((s) => (s === 0 ? 1 : 0));
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, []);

  const displayLabel = label ?? (scene === 0 ? "Simmering…" : "Packing…");

  const svg = (
    <div
      className="flex flex-col items-center justify-center gap-5"
      role="status"
      aria-live="polite"
    >
      <div className="relative" style={{ width: px, height: px }}>
        {/* Ambient gold glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full blur-2xl opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0) 68%)",
          }}
        />

        <svg
          viewBox="0 0 120 120"
          width={px}
          height={px}
          fill="none"
          aria-hidden="true"
          className="relative"
        >
          <defs>
            <linearGradient id="dl-pot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#3b3b3b" />
              <stop offset="100%" stopColor="#141414" />
            </linearGradient>
            <linearGradient id="dl-rim" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#E6C352" />
              <stop offset="55%"  stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A88929" />
            </linearGradient>
            <linearGradient id="dl-box" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#E6C352" />
              <stop offset="55%"  stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A88929" />
            </linearGradient>
            <linearGradient id="dl-box-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#F0DDA0" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>

          {/* Ground shadow — constant, anchors the scene */}
          <ellipse cx="60" cy="100" rx="34" ry="4" fill="rgba(0,0,0,0.28)" />

          <AnimatePresence mode="wait" initial={false}>
            {scene === 0 ? (
              /* ───── Pot simmering ───── */
              <motion.g
                key="pot"
                variants={sceneVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformOrigin: "60px 70px" }}
              >
                {/* Steam wisps rising */}
                <g stroke="#D4AF37" strokeWidth="2" strokeLinecap="round">
                  {[0, 1, 2].map((i) => (
                    <motion.path
                      key={i}
                      d={
                        i === 0
                          ? "M52 40 Q54 34 50 28 Q48 24 52 18"
                          : i === 1
                          ? "M60 38 Q62 32 58 26 Q56 22 60 16"
                          : "M68 40 Q70 34 66 28 Q64 24 68 18"
                      }
                      custom={i}
                      variants={steamVariants}
                      animate="animate"
                    />
                  ))}
                </g>

                {/* Pot body */}
                <path
                  d="M32 56 h56 a4 4 0 0 1 4 4 v24 a10 10 0 0 1 -10 10 h-44 a10 10 0 0 1 -10 -10 v-24 a4 4 0 0 1 4 -4 z"
                  fill="url(#dl-pot)"
                  stroke="rgba(212,175,55,0.45)"
                  strokeWidth="1.3"
                />

                {/* Pot rim */}
                <rect x="28" y="52" width="64" height="6" rx="3" fill="url(#dl-rim)" />

                {/* Handles */}
                <rect x="22" y="64" width="6" height="12" rx="3" fill="#D4AF37" />
                <rect x="92" y="64" width="6" height="12" rx="3" fill="#D4AF37" />

                {/* Simmer bubbles */}
                <g>
                  {[
                    { cx: 46, cy: 60, r: 1.6 },
                    { cx: 60, cy: 59, r: 1.9 },
                    { cx: 74, cy: 60, r: 1.4 },
                  ].map((b, i) => (
                    <motion.circle
                      key={i}
                      cx={b.cx}
                      cy={b.cy}
                      r={b.r}
                      fill="#F5F1E4"
                      custom={i}
                      variants={bubbleVariants}
                      animate="animate"
                    />
                  ))}
                </g>

                {/* Highlight */}
                <path
                  d="M36 64 q4 -4 10 -4"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.g>
            ) : (
              /* ───── Sleek delivery box packing ───── */
              <motion.g
                key="box"
                variants={sceneVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformOrigin: "60px 70px" }}
              >
                {/* Box body */}
                <rect
                  x="32" y="60" width="56" height="34" rx="3"
                  fill="url(#dl-box)"
                  stroke="rgba(168,137,41,0.55)"
                  strokeWidth="1.3"
                />

                {/* Front face lighter panel (depth) */}
                <rect
                  x="36" y="64" width="48" height="26" rx="2"
                  fill="url(#dl-box-face)"
                  opacity="0.92"
                />

                {/* Minimalist monogram label */}
                <rect x="50" y="74" width="20" height="6" rx="1" fill="#1A1A1A" />
                <line x1="52" y1="77" x2="68" y2="77" stroke="#D4AF37" strokeWidth="0.8" />

                {/* Portion falling into the box */}
                <motion.g variants={dropVariants} animate="animate">
                  <circle cx="60" cy="52" r="5" fill="#1A1A1A" stroke="#D4AF37" strokeWidth="1.2" />
                  <circle cx="60" cy="52" r="2" fill="#D4AF37" />
                </motion.g>

                {/* Left flap — hinges open then shut */}
                <motion.path
                  d="M32 60 L60 50 L60 60 Z"
                  fill="#C7A06F"
                  stroke="rgba(168,137,41,0.55)"
                  strokeWidth="1.2"
                  style={{ transformOrigin: "32px 60px" }}
                  variants={flapVariants}
                  animate="animate"
                />
                {/* Right flap */}
                <motion.path
                  d="M88 60 L60 50 L60 60 Z"
                  fill="#D4AF37"
                  stroke="rgba(168,137,41,0.55)"
                  strokeWidth="1.2"
                  style={{ transformOrigin: "88px 60px" }}
                  variants={flapVariants}
                  animate="animate"
                />

                {/* Base hairline */}
                <line
                  x1="32" y1="94" x2="88" y2="94"
                  stroke="rgba(168,137,41,0.55)"
                  strokeWidth="1"
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <motion.div
        key={scene}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-1.5"
      >
        <span
          className="font-serif italic text-[15px] tracking-wide"
          style={{ color: "var(--brand, #D4AF37)" }}
        >
          {displayLabel}
        </span>
        <span
          className="block w-14 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent, #D4AF37) 50%, transparent)",
          }}
        />
      </motion.div>

      <span className="sr-only">Loading content</span>
    </div>
  );

  if (!fullscreen) return svg;

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "var(--bg, #F9F8F3)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 500px at 50% 35%, rgba(212,175,55,0.14), transparent 70%), radial-gradient(600px 400px at 50% 80%, rgba(27,48,34,0.10), transparent 70%)",
        }}
      />
      <div className="relative">{svg}</div>
    </motion.div>
  );
}
