"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { SearchIcon, MapleLeafIcon, LocationPinIcon, AlertTriangleIcon, CheckCircleIcon, LockIcon, HomeIcon, StarIcon } from "@/components/ui/Icons";
import { formatPostal, validatePostal } from "@/lib/utils";

const ChefHeroScene = dynamic(() => import("@/components/ui/ChefHeroScene"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%", height: "clamp(320px, 42vw, 500px)",
      borderRadius: "24px", background: "#d6f0e9", animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
    }} />
  ),
});

const STATS = [
  { n: "2,400+", l: "Active Chefs" },
  { n: "140+",   l: "Cuisines"     },
  { n: "10",     l: "Provinces"    },
];

const TRUST = [
  { icon: <CheckCircleIcon size={14} />, label: "Verified Cooks" },
  { icon: <HomeIcon size={14} />,        label: "Home Cooked"    },
  { icon: <StarIcon filled={true} />,    label: "4.9★ Avg"       },
  { icon: <LockIcon size={14} />,        label: "Secure Pay"     },
];

export function HeroSection() {
  const [postal,       setPostal]       = useState("");
  const [postalError,  setPostalError]  = useState("");
  const [searchDone,   setSearchDone]   = useState(false);
  const [focused,      setFocused]      = useState(false);
  const [visible,      setVisible]      = useState(false);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  const handleSearch = () => {
    if (!postal.trim()) { setPostalError("Please enter a Canadian postal code"); return; }
    if (!validatePostal(postal)) { setPostalError("Invalid format — try M5V 3A8 or K1A 0B1"); return; }
    setPostalError("");
    setSearchDone(true);
    setTimeout(() => {
      document.getElementById("chefs-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <>
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 pt-16">

        {/* ── Left ── */}
        <div
          className="flex flex-col justify-center px-6 py-12 md:px-14 md:py-16 transition-all duration-700"
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? "none" : "translateX(-24px)",
            transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Canadian badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100
                          border-[1.5px] border-green-200 rounded-full px-4 py-2 mb-7
                          self-start animate-float">
            <span className="text-green-600"><MapleLeafIcon /></span>
            <span className="text-[13px] font-bold text-green-800 tracking-wide">
              Serving Your Neighbourhood
            </span>
            <span className="bg-green-600 text-white text-[10px] font-black px-2 py-0.5
                             rounded-full uppercase tracking-widest">
              Canada
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif font-black leading-[1.1] mb-5 text-gray-900"
              style={{ fontSize: "clamp(32px, 3.8vw, 54px)" }}>
            <span className="block">Homemade food,</span>
            <span className="block gradient-text">served to</span>
            <span className="block">your plate.</span>
          </h1>

          <p className="text-[16.5px] text-gray-500 leading-relaxed mb-8 max-w-[430px]">
            Discover passionate home cooks in your Canadian neighbourhood — authentic,
            cultural, and lovingly prepared meals just like grandma used to make.
          </p>

          {/* Search bar */}
          <div className="mb-5">
            <div
              className="flex items-center bg-white rounded-2xl overflow-hidden
                         transition-all duration-300 p-1 pl-4"
              style={{
                border:     `2px solid ${postalError ? "#EF4444" : focused ? "#4d9e8a" : "#7dcfc1"}`,
                boxShadow:  focused ? "0 0 0 4px rgba(77, 158, 138,0.15)" : "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <span className="text-gray-400 mr-2 flex-shrink-0"><LocationPinIcon size={17} /></span>
              <input
                value={postal}
                onChange={(e) => { setPostal(formatPostal(e.target.value)); setPostalError(""); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="A1A 1A1 — Enter postal code"
                className="flex-1 min-w-0 border-none outline-none text-[15.5px] bg-transparent
                           text-gray-900 py-3 tracking-widest placeholder:tracking-normal
                           placeholder:text-gray-400 font-medium"
              />
              <button
                onClick={handleSearch}
                className="btn-primary flex items-center gap-1.5 px-5 py-3 text-sm rounded-xl flex-shrink-0"
              >
                <SearchIcon /> Find Cooks
              </button>
            </div>

            {postalError && (
              <p className="text-red-500 text-sm mt-1.5 font-medium flex items-center gap-1.5">
                <AlertTriangleIcon size={13} /> {postalError}
              </p>
            )}
            {searchDone && !postalError && (
              <p className="text-green-600 text-sm mt-1.5 font-semibold flex items-center gap-1.5">
                <CheckCircleIcon size={14} /> Showing cooks near {postal}
              </p>
            )}
            {!searchDone && !postalError && (
              <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1.5">
                <span className="text-green-500"><MapleLeafIcon size={11} /></span>
                Format: A1A 1A1 · All Canadian provinces served
              </p>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-3 flex-wrap">
            {TRUST.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[13px] text-gray-600 font-medium">
                <span className="text-green-600">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right (chef scene) ── */}
        <div
          className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-16 transition-all duration-700"
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? "none" : "translateX(24px)",
            transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
            transitionDelay: "0.2s",
          }}
        >
          <ChefHeroScene />

          {/* Stats row */}
          <div className="flex justify-around mt-5">
            {STATS.map(({ n, l }) => (
              <div key={l} className="text-center">
                <div className="font-serif font-black text-2xl text-gray-900">{n}</div>
                <div className="text-xs text-gray-500 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
