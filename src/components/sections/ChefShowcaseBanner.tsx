"use client";

import Image from "next/image";

const STATS = [
  { n: "2,400+", l: "Home Chefs"  },
  { n: "140+",   l: "Cuisines"    },
  { n: "4.9",    l: "Avg Rating ★" },
];

export function ChefShowcaseBanner() {
  const scrollToChefs = () =>
    document.getElementById("chefs-section")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-950"
      style={{ minHeight: "clamp(340px, 54vw, 660px)" }}
    >
      {/* ── Full-bleed chef photo ── */}
      <Image
        src="https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1800&h=1000&fit=crop&auto=format&q=80"
        alt="Home chef cooking in their kitchen"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-[1.01]"
      />

      {/* ── Overlays for text legibility ── */}
      {/* Strong left-to-right gradient — inline rgba so it always renders */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(5,10,20,0.97) 0%, rgba(5,10,20,0.88) 35%, rgba(5,10,20,0.55) 60%, rgba(5,10,20,0.10) 85%, rgba(5,10,20,0) 100%)",
        }}
      />
      {/* Top + bottom vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,10,20,0.45) 0%, transparent 25%, transparent 70%, rgba(5,10,20,0.55) 100%)",
        }}
      />

      {/* ── Text content ── */}
      <div
        className="relative z-10 flex items-center px-6 py-14
                   sm:px-10 md:px-16 lg:px-24"
        style={{ minHeight: "clamp(340px, 54vw, 660px)" }}
      >
        <div className="w-full max-w-[580px]">

          {/* Eyebrow — custom color for dark bg */}
          <div
            className="flex items-center gap-3 mb-5 text-[11px] font-bold
                       tracking-[0.14em] uppercase"
            style={{ color: "#6ee7b7" }}
          >
            <span className="h-px w-7 bg-green-400/50 flex-shrink-0" />
            Real Kitchens · Real People
            <span className="h-px w-7 bg-green-400/50 flex-shrink-0" />
          </div>

          {/* Headline */}
          <h2
            className="font-serif font-black text-white leading-[1.08] mb-5"
            style={{ fontSize: "clamp(26px, 4.2vw, 62px)" }}
          >
            Your neighbour is<br className="hidden sm:block" />
            a world&#8209;class chef.
          </h2>

          {/* Body */}
          <p
            className="leading-relaxed mb-9"
            style={{
              fontSize: "clamp(13.5px, 1.15vw, 17px)",
              maxWidth: "460px",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            They cook with recipes passed down through generations —
            no shortcuts, no industrial kitchens. Just real food made
            with love, right next door.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-10 gap-y-5 mb-9">
            {STATS.map(({ n, l }) => (
              <div key={l}>
                <div
                  className="font-serif font-black text-white leading-none"
                  style={{ fontSize: "clamp(20px, 2.4vw, 34px)" }}
                >
                  {n}
                </div>
                <div className="text-[11px] font-semibold tracking-wider uppercase mt-1"
                     style={{ color: "rgba(255,255,255,0.50)" }}>
                  {l}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={scrollToChefs}
            className="btn-primary px-7 py-3.5"
            style={{ fontSize: "clamp(13px, 1.1vw, 15px)" }}
          >
            Find Cooks Near You →
          </button>
        </div>
      </div>

      {/* ── Decorative bottom border ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r
                      from-transparent via-green-400/30 to-transparent" />
    </section>
  );
}
