"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useTheme, ROLE_TO_THEME, type Theme } from "@/context/ThemeContext";

/**
 * Hero imagery — premium food / hospitality photography from Unsplash.
 * Swap the `image` field with your own CDN / Spline 3D assets for production.
 *
 * Premium Unsplash alternatives worth A/B testing:
 *   Cook     — photo-1607532941433-304659e8198a  (chef plating)
 *              photo-1600891964092-4316c288032e  (hands in kitchen)
 *   Foodie   — photo-1414235077428-338989a2e8c0  (dining table vignette)
 *              photo-1565299624946-b28f40a0ae38  (artisan pizza)
 *   Courier  — photo-1513639304702-9f1c7a9e1022  (cyclist courier)
 *              photo-1558383331-f520f2888351     (delivery bag handoff)
 *
 * For true 3D depth, replace <Image> with an <iframe> pointing at a
 * Spline scene (e.g. https://my.spline.design/your-scene/) — the glass
 * panel below will still render cleanly on top.
 */
const ROLES = [
  {
    slug: "cook",
    eyebrow: "For Chefs",
    title: "Cook",
    tagline: "Your kitchen. Your craft. Your clientele.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1100&h=900&fit=crop&q=85",
    accent: "from-[#1e4c3f]/60 via-[#1e4c3f]/10 to-[#0f2a23]/80",
  },
  {
    slug: "foodie",
    eyebrow: "For Guests",
    title: "Foodie",
    tagline: "Curated home kitchens, delivered to your table.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1100&h=900&fit=crop&q=85",
    accent: "from-[#8f6338]/55 via-[#0f2a23]/10 to-[#0f2a23]/80",
  },
  {
    slug: "delivery",
    eyebrow: "For Couriers",
    title: "Courier",
    tagline: "Flexible routes. White-glove deliveries.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1100&h=900&fit=crop&q=85",
    accent: "from-[#1e4c3f]/55 via-[#1e4c3f]/10 to-[#0f2a23]/80",
  },
];

export function RoleTilesHero() {
  const [hovered, setHovered] = useState<string | null>(null);
  const { setTheme } = useTheme();

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-5 md:px-10 overflow-hidden">
      {/* Ambient gradient wash for depth behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 500px at 50% -10%, rgba(184,137,90,0.14), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(30,76,63,0.10), transparent 60%)",
        }}
      />
      {/* Fine grain texture for "paper" feel (CSS only — no extra request) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(#0f1c1a 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="max-w-[1240px] mx-auto">
        {/* Intro — editorial serif headline */}
        <div className="text-center mb-12 md:mb-16 max-w-[780px] mx-auto animate-slide-up">
          <div className="eyebrow justify-center mb-5">A Curated Home Kitchen Marketplace</div>

          <h1
            className="font-serif text-[var(--text-primary)] mb-5"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              fontWeight: 800,
            }}
          >
            Where home kitchens <br className="hidden md:block" />
            become <span className="italic-accent">destinations.</span>
          </h1>

          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-[560px] mx-auto leading-relaxed">
            Three ways to belong to Dished. Pick your path — we&rsquo;ll show you
            exactly how the table is set.
          </p>
        </div>

        {/* Tiles — compact imagery with always-visible glass content panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 perspective-1000">
          {ROLES.map((role, idx) => (
            <RoleTile
              key={role.slug}
              role={role}
              index={idx}
              hovered={hovered}
              setHovered={setHovered}
              setTheme={setTheme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

type Role = (typeof ROLES)[number];

function RoleTile({
  role,
  index,
  hovered,
  setHovered,
  setTheme,
}: {
  role: Role;
  index: number;
  hovered: string | null;
  setHovered: (s: string | null) => void;
  setTheme: (t: Theme) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });

  const isHovered = hovered === role.slug;
  const isDimmed  = hovered !== null && !isHovered;
  const roleTheme: Theme = ROLE_TO_THEME[role.slug] ?? "customer";

  /* Parallax tilt — follow pointer, clamped + eased for a premium feel. */
  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5; // -0.5..0.5
    const py = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({
      rx: -py * 6,
      ry:  px * 8,
      tx:  px * 8,
      ty:  py * 6,
    });
  }, []);

  const onEnter = useCallback(() => {
    setHovered(role.slug);
  }, [role.slug, setHovered]);

  const onLeave = useCallback(() => {
    setHovered(null);
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 });
  }, [setHovered]);

  /* Theme switches ONLY on click — hover just handles the visual tilt/parallax. */
  const onClick = useCallback(() => {
    setTheme(roleTheme);
  }, [roleTheme, setTheme]);

  return (
    <Link
      ref={ref}
      href={`/how-it-works/${role.slug}`}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      onTouchStart={onEnter}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${isHovered ? -6 : 0}px)`,
        transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease",
        animationDelay: `${index * 90}ms`,
      }}
      className={`group relative block rounded-[28px] overflow-hidden
                  will-change-transform animate-slide-up
                  ${isDimmed ? "opacity-70" : "opacity-100"}`}
      aria-label={`${role.title} — ${role.tagline}`}
    >
      {/* ── Layer 1: compact image (shorter, text always visible above) ── */}
      <div className="relative h-[260px] sm:h-[300px] md:h-[340px] overflow-hidden">
        <Image
          src={role.image}
          alt=""
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-transform duration-[900ms] ease-out
                     ${isHovered ? "scale-[1.08]" : "scale-[1.02]"}`}
          style={{ transform: `translate3d(${tilt.tx * -0.6}px, ${tilt.ty * -0.6}px, 0)` }}
        />

        {/* Emerald / gold tint overlay that breathes with hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${role.accent}
                      mix-blend-multiply transition-opacity duration-500
                      ${isHovered ? "opacity-100" : "opacity-85"}`}
        />

        {/* Legibility mask — bottom fade into ivory panel */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[rgba(251,248,241,0.96)]" />

        {/* Courier tile: Dished logo on delivery bag/equipment */}
        {role.slug === "delivery" && (
          <div
            className="absolute bottom-32 right-8 w-16 h-16 md:w-20 md:h-20
                       rounded-2xl flex items-center justify-center
                       bg-white/90 backdrop-blur-sm
                       border border-[rgba(184,137,90,0.3)]
                       shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]
                       rotate-[-6deg]"
            aria-hidden="true"
          >
            <Image
              src="/dished_logosvg.svg"
              alt=""
              width={48}
              height={48}
              className="object-contain opacity-85"
            />
          </div>
        )}

        {/* Floating eyebrow chip (top-left) */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           text-[10px] font-semibold tracking-[0.18em] uppercase
                           text-[var(--emerald-900)] bg-[rgba(251,248,241,0.88)]
                           backdrop-blur-md border border-[rgba(184,137,90,0.35)]
                           shadow-[0_6px_18px_-6px_rgba(15,28,26,0.35)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
            {role.eyebrow}
          </span>
        </div>

        {/* Corner monogram — serif initial in gold ring */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full
                        bg-[rgba(251,248,241,0.92)] backdrop-blur-md
                        flex items-center justify-center
                        font-serif font-bold text-xl text-[var(--emerald-900)]
                        border border-[rgba(184,137,90,0.45)]
                        shadow-[0_8px_22px_-6px_rgba(15,28,26,0.40)]
                        group-hover:rotate-[8deg] transition-transform duration-500">
          {role.title.charAt(0)}
        </div>
      </div>

      {/* ── Layer 2: always-visible glass content panel ─────────────── */}
      <div className="glass-panel relative px-6 py-6 md:px-7 md:py-7">
        <h2
          className="font-serif text-[var(--text-primary)] mb-2"
          style={{
            fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            fontWeight: 700,
          }}
        >
          {role.title}
        </h2>

        <p className="text-[14.5px] md:text-[15px] text-[var(--text-secondary)] leading-relaxed mb-5 max-w-[320px]">
          {role.tagline}
        </p>

        <span
          className={`inline-flex items-center font-semibold text-[13px] uppercase tracking-[0.16em]
                     text-[var(--emerald-800)] transition-all duration-300
                     ${isHovered ? "gap-3" : "gap-2"}`}
        >
          See how it works
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>

        {/* Gold hairline underscore that animates on hover */}
        <div
          className={`absolute left-6 right-6 bottom-0 h-[2px]
                      bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent
                      transition-opacity duration-500
                      ${isHovered ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* ── Layer 3: ambient drop-shadow that reads as Z-axis depth ── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-x-2 -bottom-6 h-10 rounded-[40px]
                   blur-2xl transition-opacity duration-500
                   ${isHovered ? "opacity-80" : "opacity-50"}`}
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(15,28,26,0.30), transparent)" }}
      />
    </Link>
  );
}
