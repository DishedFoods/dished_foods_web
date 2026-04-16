"use client";

import { useEffect, useRef, useState } from "react";

/* ── Feature data for "Why Order With Us" ── */
const FEATURES = [
  {
    title: "Affordable",
    subtitle: "Pay for the food, not the rent",
    body: "Home kitchen food is genuinely lower cost \u2014 because there\u2019s no overhead being passed to you. Nutritious meals that don\u2019t strain your budget.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Your roots, nearby",
    subtitle: "Filter by your hometown cuisine",
    body: "Missing food from back home? Filter by cuisine, region, or dish type. Find a chef who grew up cooking the same food your mother made.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
      </svg>
    ),
  },
  {
    title: "Choose your chef",
    subtitle: "Real profiles, real reviews",
    body: "Browse chef profiles, read ratings from your community, and pick someone whose story and menu speak to you. You\u2019re not ordering from a brand \u2014 you\u2019re ordering from a person.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/* ── Scroll-reveal helper ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15, rootMargin: "-30px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

export function FoodieManifesto() {
  const hero = useReveal();
  const who = useReveal();
  const what = useReveal();
  const why = useReveal();

  return (
    <section className="relative px-5 md:px-10 overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="max-w-[960px] mx-auto">

        {/* ── Hero headline ── */}
        <div
          ref={hero.ref}
          className={`reveal-up pt-16 pb-14 md:pt-24 md:pb-20 text-center ${hero.visible ? "is-visible" : ""}`}
        >
          <h1
            className="font-serif font-black leading-[1.04] mb-5"
            style={{ color: "var(--text-primary)", fontSize: "clamp(2rem, 5vw, 3.6rem)", letterSpacing: "-0.02em" }}
          >
            Home-cooked food,{" "}
            <span style={{ color: "var(--accent)" }}>made by someone who cares.</span>
          </h1>
          <p
            className="text-[17px] md:text-[20px] max-w-[620px] mx-auto"
            style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
          >
            Save money. Eat better. Taste home.
          </p>
          <div
            aria-hidden="true"
            className="mx-auto mt-10 h-px max-w-[200px]"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
          />
        </div>

        {/* ── Who We Are ── */}
        <div
          ref={who.ref}
          className={`reveal-up pb-16 md:pb-24 ${who.visible ? "is-visible" : ""}`}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6
                       text-[11px] font-black tracking-[0.14em] uppercase"
            style={{
              color: "var(--accent)",
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            Who We Are
          </div>

          <h2
            className="font-serif font-black mb-6"
            style={{ color: "var(--text-primary)", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            Home-cooked food, made by someone who cares.
          </h2>

          <p
            className="text-[16px] md:text-[17px] leading-[1.75] mb-10 max-w-[780px]"
            style={{ color: "var(--text-secondary)" }}
          >
            Dished is a community of passionate, certified home chefs cooking real food in real
            kitchens &mdash; and making it available to you at prices that actually make sense. No
            restaurant markups. No industrial kitchen shortcuts. Just honest, affordable, locally made
            food prepared by your neighbour.
          </p>

          <blockquote
            className="relative pl-6 md:pl-8 py-1"
            style={{ borderLeft: "3px solid var(--accent)" }}
          >
            <p
              className="font-serif italic text-[18px] md:text-[22px] leading-[1.5]"
              style={{ color: "var(--text-primary)" }}
            >
              &ldquo;We believe the best meal you&rsquo;ll have this week won&rsquo;t come from a
              chain &mdash; it&rsquo;ll come from someone&rsquo;s kitchen two streets away.&rdquo;
            </p>
          </blockquote>
        </div>

        {/* ── What We Do ── */}
        <div
          ref={what.ref}
          className={`reveal-up pb-16 md:pb-24 ${what.visible ? "is-visible" : ""}`}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6
                       text-[11px] font-black tracking-[0.14em] uppercase"
            style={{
              color: "var(--accent)",
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            What We Do
          </div>

          <h2
            className="font-serif font-black mb-6"
            style={{ color: "var(--text-primary)", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            Save money. Eat better. Taste home.
          </h2>

          <p
            className="text-[16px] md:text-[17px] leading-[1.75] max-w-[780px]"
            style={{ color: "var(--text-secondary)" }}
          >
            Restaurant food is expensive because restaurants carry enormous costs &mdash; rent, staff,
            utilities, branding. Dished cuts all of that out. You get the same love and skill, at a
            fraction of the price, from chefs who cook because they genuinely love to.
          </p>
        </div>

        {/* ── Why Order With Us ── */}
        <div
          ref={why.ref}
          className={`reveal-up pb-20 md:pb-28 ${why.visible ? "is-visible" : ""}`}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6
                       text-[11px] font-black tracking-[0.14em] uppercase"
            style={{
              color: "var(--accent)",
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            Why Order With Us
          </div>

          <h2
            className="font-serif font-black mb-10"
            style={{ color: "var(--text-primary)", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            Better food, better price, better story.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 md:p-7 transition-shadow duration-300 hover:shadow-lg"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "var(--surface-2)", color: "var(--accent)" }}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-serif font-bold text-[18px] mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-[13px] font-semibold mb-2"
                  style={{ color: "var(--accent)" }}
                >
                  {f.subtitle}
                </p>
                <p
                  className="text-[14px] md:text-[15px] leading-[1.7]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
