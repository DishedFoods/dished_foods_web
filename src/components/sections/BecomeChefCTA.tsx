"use client";

import { useState } from "react";
import { MapleLeafIcon } from "@/components/ui/Icons";

export function BecomeChefCTA() {
  const [showMsg, setShowMsg] = useState(false);

  const scrollToHow = () =>
    document.getElementById("how-section")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleBecomeChef = () => {
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3000);
  };

  return (
    <section className="py-14 px-4 md:py-20 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-950 rounded-[28px]
                          overflow-hidden relative px-6 py-10 md:px-16 md:py-14 text-center">

            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Decorative maple leaves */}
            <div className="absolute top-5 left-6 text-white opacity-10 pointer-events-none" aria-hidden="true">
              <MapleLeafIcon size={40} />
            </div>
            <div className="absolute bottom-5 right-6 text-white opacity-[0.07] pointer-events-none" aria-hidden="true">
              <MapleLeafIcon size={60} />
            </div>

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-300 text-xs font-bold
                              px-4 py-1.5 rounded-full mb-4 border border-green-600/30
                              tracking-widest uppercase">
                <MapleLeafIcon size={11} /> Join the Movement
              </div>

              <h2 className="font-serif font-black text-[26px] md:text-[36px] text-white leading-[1.2] mb-3.5">
                Turn your passion for cooking into a thriving business
              </h2>
              <p className="text-white/65 text-base leading-relaxed max-w-[520px] mx-auto mb-8">
                Join 2,400+ chefs across Canada earning on their own schedule. We handle
                compliance, payments, and discovery — you handle the cooking.
              </p>

              <div className="flex gap-3.5 justify-center flex-wrap">
                <button
                  onClick={handleBecomeChef}
                  className="relative btn-primary px-8 py-3.5 text-base
                             shadow-[0_6px_24px_rgba(77,158,138,0.38)]"
                >
                  Become a Chef — Free
                  <span className="ml-2 text-[9px] font-black bg-white/25 px-1.5 py-0.5
                                   rounded-full uppercase tracking-wide leading-none">
                    Soon
                  </span>
                </button>
                <button
                  onClick={scrollToHow}
                  className="px-8 py-3.5 rounded-xl border-2 border-white/25 bg-transparent
                             text-white font-semibold text-base cursor-pointer transition-all
                             hover:border-white/50 font-sans"
                >
                  Learn More →
                </button>
              </div>

              {showMsg && (
                <p className="text-green-300 text-[13px] font-semibold mt-4 animate-fade-in">
                  Chef registration is coming soon — stay tuned!
                </p>
              )}
              {!showMsg && (
                <p className="text-white/35 text-[12.5px] mt-4 flex items-center justify-center gap-1.5">
                  <MapleLeafIcon size={11} /> Province-specific compliance handled automatically · 0% commission first month
                </p>
              )}
            </div>
          </div>
        </div>
    </section>
  );
}
