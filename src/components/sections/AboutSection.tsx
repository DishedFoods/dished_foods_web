import Image from "next/image";
import { MapleLeafIcon, HomeIcon, ShieldIcon, GlobeIcon } from "@/components/ui/Icons";
import { GALLERY_PHOTOS } from "@/lib/data";

const VALUES = [
  { icon: <HomeIcon size={20} />,   t: "Community First",  d: "We serve every Canadian province, from Victoria to St. John's." },
  { icon: <ShieldIcon />,           t: "Safety & Trust",   d: "Every chef is verified. Every kitchen inspected. Every order protected." },
  { icon: <GlobeIcon size={20} />,  t: "Cultural Pride",   d: "140+ cuisines represented across our growing chef community." },
];

export function AboutSection() {
  return (
    <section
      id="about-section"
      className="relative bg-[var(--ivory)] py-20 px-5 md:py-28 md:px-12 overflow-hidden"
    >
      {/* Ambient gold wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(900px 500px at 10% 10%, rgba(184,137,90,0.10), transparent 60%), radial-gradient(700px 400px at 90% 90%, rgba(30,76,63,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Left — story */}
        <div>
          <div className="eyebrow mb-5">Our Story</div>
          <h2
            className="font-serif text-[var(--text-primary)] mb-6"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 800,
            }}
          >
            Food that carries a <span className="italic-accent">story</span>,
            a culture, a home.
          </h2>
          <p className="text-[var(--text-secondary)] leading-[1.85] text-[15.5px] mb-4">
            Dished was born from a simple belief: the best meals in Canada
            aren&apos;t in restaurants — they&apos;re in the homes of the
            neighbours next door. From coast to coast to coast, talented home
            cooks are turning family recipes into something the whole country
            can taste.
          </p>
          <p className="text-[var(--text-secondary)] leading-[1.85] text-[15.5px] mb-8">
            We built an open platform for every Canadian kitchen — welcoming
            every cuisine, every tradition, every skill level — so cooks can
            share their craft legally, safely, and profitably.
          </p>

          <div className="flex flex-col gap-4">
            {VALUES.map(({ icon, t, d }) => (
              <div key={t} className="flex gap-4 items-start">
                <div
                  className="w-[46px] h-[46px] rounded-2xl flex-shrink-0
                             flex items-center justify-center
                             text-[var(--emerald-800)]
                             bg-gradient-to-br from-[var(--ivory)] to-[var(--ivory-2)]
                             border border-[var(--hairline)]
                             shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_20px_-10px_rgba(15,28,26,0.18)]"
                >
                  {icon}
                </div>
                <div>
                  <div className="font-serif font-bold text-[16px] text-[var(--text-primary)] mb-0.5">
                    {t}
                  </div>
                  <div className="text-[13.5px] text-[var(--text-muted)] leading-relaxed">
                    {d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — editorial gallery with staggered 3D depth */}
        <div className="grid grid-cols-2 gap-3.5">
          {GALLERY_PHOTOS.map((src, i) => {
            const rotate = i % 2 === 0 ? "-rotate-[0.8deg]" : "rotate-[0.8deg]";
            return (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden depth-floating
                            transition-all duration-500 ease-out
                            hover:translate-y-[-6px] hover:rotate-0 ${rotate}
                            animate-parallax`}
                style={{
                  height: i % 2 === 0 ? 220 : 170,
                  alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                <Image
                  src={src}
                  alt="chef kitchen"
                  width={500}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}

          <div
            className="col-span-2 flex items-center justify-center gap-3 mt-3
                       text-[12px] text-[var(--gold-dark)] font-semibold tracking-[0.18em] uppercase"
          >
            <MapleLeafIcon />
            Proudly Canadian · 140+ Cuisines
            <MapleLeafIcon />
          </div>
        </div>
      </div>
    </section>
  );
}
