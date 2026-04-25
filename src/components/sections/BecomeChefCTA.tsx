"use client";

import { MapleLeafIcon } from "@/components/ui/Icons";
import { LeadCaptureForm } from "./LeadCaptureForm";

export function BecomeChefCTA() {
  return (
    <section id="become-a-chef-waitlist" className="py-20 px-4 md:py-28 md:px-12">
      <div className="max-w-[960px] mx-auto">
        <div
          className="relative overflow-hidden rounded-[32px] px-6 py-12 md:px-16 md:py-16
                     bg-gradient-to-b from-white to-[var(--ivory)]
                     border border-[var(--hairline)]
                     depth-floating"
        >
          {/* Gold hairline top border for editorial feel */}
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
          />

          {/* Ambient corner glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-60"
            style={{ background: "radial-gradient(circle, rgba(184,137,90,0.25), transparent 70%)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-60"
            style={{ background: "radial-gradient(circle, rgba(30,76,63,0.18), transparent 70%)" }}
          />

          {/* Decorative maple leaves — muted ivory tone */}
          <div className="absolute top-6 left-8 text-[var(--gold-light)] pointer-events-none" aria-hidden="true">
            <MapleLeafIcon size={38} />
          </div>
          <div className="absolute bottom-6 right-8 text-[var(--gold-light)] pointer-events-none" aria-hidden="true">
            <MapleLeafIcon size={56} />
          </div>

          <div className="relative">
            <LeadCaptureForm />
          </div>
        </div>
      </div>
    </section>
  );
}
