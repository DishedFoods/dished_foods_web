"use client";

import Link from "next/link";
import Image from "next/image";
import { MapleLeafIcon } from "@/components/ui/Icons";
import { CANADIAN_PROVINCES } from "@/lib/data";

// href   = real page link
// sectionId = smooth-scroll to section on home page
// null   = coming soon
const FOOTER_LINKS = [
  {
    title: "Company",
    links: [
      { label: "About Us",    sectionId: "about-section", href: null },
      { label: "How It Works",sectionId: "dual-role",   href: null },
      { label: "Our Chefs",   sectionId: "chefs-section", href: null },
      { label: "Blog",        sectionId: null,             href: null },
    ],
  },
  {
    title: "Chefs",
    links: [
      { label: "Become a Chef",    sectionId: null, href: null },
      { label: "Chef Dashboard",   sectionId: null, href: null },
      { label: "Compliance Guide", sectionId: null, href: null },
      { label: "Pricing",          sectionId: null, href: null },
    ],
  },
  {
    title: "Legal & Support",
    links: [
      { label: "Privacy Policy", sectionId: null, href: "/privacy" },
      { label: "Terms of Service", sectionId: null, href: "/terms" },
      { label: "FAQ",             sectionId: null, href: "/faq" },
      { label: "Help Centre",    sectionId: null, href: null },
      { label: "Contact Us",     sectionId: null, href: "mailto:support@dished.ca" },
    ],
  },
];

export function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer
      className="relative pt-16 pb-8 px-5 md:px-12 text-white/65"
      style={{
        background:
          "radial-gradient(1000px 400px at 20% 0%, rgba(30,76,63,0.55), transparent 60%), linear-gradient(180deg, #0f1c1a 0%, #081411 100%)",
      }}
    >
      {/* Gold hairline across the top of the footer */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
      />
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-9">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
                <Image src="/dished_logo1.png" width={32} height={32} alt="Dished" className="w-full h-full object-contain p-1" />
              </div>
              <span className="font-serif text-2xl text-white" style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>Dished</span>
            </div>
            <p className="text-sm leading-relaxed max-w-[260px]">
              Canada&apos;s home kitchen marketplace. Connecting passionate chefs with hungry
              neighbours, one authentic meal at a time.{" "}
              <span className="inline-block text-green-500 align-middle"><MapleLeafIcon size={13} /></span>
            </p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {["Twitter", "Instagram", "LinkedIn"].map((s) => (
                <span key={s} title="Coming soon"
                  className="text-xs text-white/30 border border-white/10 px-2.5 py-1
                             rounded-lg cursor-not-allowed select-none">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ title, links }) => (
            <div key={title}>
              <div className="text-white font-bold mb-3 text-sm">{title}</div>
              {links.map(({ label, sectionId, href }) => (
                <div key={label} className="mb-2.5">
                  {href ? (
                    // Real page or mailto link
                    href.startsWith("mailto:") ? (
                      <a href={href}
                        className="text-sm text-white/60 hover:text-[#e6c89a] transition-colors duration-200">
                        {label}
                      </a>
                    ) : (
                      <Link href={href}
                        className="text-sm text-white/60 hover:text-[#e6c89a] transition-colors duration-200">
                        {label}
                      </Link>
                    )
                  ) : sectionId ? (
                    // Scroll-to-section
                    <button onClick={() => scrollTo(sectionId)}
                      className="text-sm text-white/60 hover:text-[#e6c89a] transition-colors duration-200
                                 bg-transparent border-none cursor-pointer font-sans text-left">
                      {label}
                    </button>
                  ) : (
                    // Coming soon
                    <span title="Coming soon"
                      className="text-sm text-white/25 cursor-not-allowed select-none flex items-center gap-1.5">
                      {label}
                      <span className="text-[9px] font-bold text-white/20 border border-white/10
                                       px-1 py-0.5 rounded uppercase tracking-wide">
                        Soon
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Provinces */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {CANADIAN_PROVINCES.map((p) => (
            <span key={p}
              className="text-[11px] text-[#e6c89a] bg-[rgba(184,137,90,0.12)] border border-[rgba(184,137,90,0.25)] px-2.5 py-0.5 rounded-md font-semibold tracking-wide">
              {p}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-5 flex flex-col sm:flex-row
                        justify-between items-start sm:items-center gap-2">
          <div className="text-xs flex items-center gap-1.5">
            <MapleLeafIcon size={12} />
            © {new Date().getFullYear()} Dished Inc. · Made in Canada · All provinces served
          </div>
          <div className="flex items-center gap-3 text-xs text-white/30">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <span>·</span>
            <span>Built with love for home cooks everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
