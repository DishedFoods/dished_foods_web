"use client";

import { useEffect, useRef, useState } from "react";

/* ── Feature data for "Why Cook With Us" ── */
const FEATURES = [
  {
    title: "Flexible hours",
    body: "Available weekends only? Evenings after work? That\u2019s perfectly fine. You set your own schedule and post your availability. Your kitchen, your clock.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Zero overhead",
    body: "No rent. No wastage. You cook to order or post what you\u2019ve made. The margin you earn stays with you \u2014 not with a landlord or a franchisor.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Hot Line",
    body: "Sell your surplus tonight. Made extra Biryani for 20 and have 3 portions left? Post them on the Hot Line at a markdown. Someone nearby picks it up. Nothing goes to waste.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Reputation builder",
    body: "Grow your ratings, grow your reach. Every order is a review. Every review builds your profile. Your name and your food travel further than your neighbourhood \u2014 all without spending on ads.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

export function ChefManifesto() {
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
            Your Passion Deserves a Stage,{" "}
            <span style={{ color: "var(--accent)" }}>Not a Price Tag.</span>
          </h1>
          <p
            className="text-[17px] md:text-[20px] max-w-[600px] mx-auto"
            style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
          >
            Turn your kitchen into a business&mdash;on your terms.
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
            The Wall Between You and Your Dream Just Came Down.
          </h2>

          <p
            className="text-[16px] md:text-[17px] leading-[1.75] mb-10 max-w-[780px]"
            style={{ color: "var(--text-secondary)" }}
          >
            We built Dished for every person who has ever cooked a meal that made someone&rsquo;s eyes
            light up &mdash; and then wondered, &ldquo;what if I could do this for more people?&rdquo;
            You don&rsquo;t need a restaurant. You don&rsquo;t need investors. You just need your
            kitchen, your skill, and the will to share what you love.
          </p>

          <blockquote
            className="relative pl-6 md:pl-8 py-1"
            style={{ borderLeft: "3px solid var(--accent)" }}
          >
            <p
              className="font-serif italic text-[18px] md:text-[22px] leading-[1.5]"
              style={{ color: "var(--text-primary)" }}
            >
              &ldquo;The biggest barrier to food entrepreneurship isn&rsquo;t talent &mdash;
              it&rsquo;s the rent. We removed that wall.&rdquo;
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
            We turn your kitchen into a business, on your terms.
          </h2>

          <p
            className="text-[16px] md:text-[17px] leading-[1.75] max-w-[780px]"
            style={{ color: "var(--text-secondary)" }}
          >
            Dished gives passionate home cooks and hobby chefs a verified, trusted platform to list
            their food, build a customer base, and earn &mdash; without the crushing overhead of a
            brick-and-mortar setup. No rent. No long-term commitment. Just you, your recipes, and
            your community.
          </p>
        </div>

        {/* ── Why Cook With Us ── */}
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
            Why Cook With Us
          </div>

          <h2
            className="font-serif font-black mb-10"
            style={{ color: "var(--text-primary)", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}
          >
            Built for cooks, not corporations.
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
                  className="font-serif font-bold text-[18px] mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.title}
                </h3>
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
