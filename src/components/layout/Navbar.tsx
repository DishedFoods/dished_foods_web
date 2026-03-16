"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MenuIcon, XIcon } from "@/components/ui/Icons";
import { Toast } from "@/components/ui/Toast";

const NAV_ITEMS = [
  { label: "Find Cooks",   id: "chefs-section" },
  { label: "How It Works", id: "how-section"   },
  { label: "About",        id: "about-section" },
];

export function Navbar() {
  const [activeNav, setActiveNav] = useState("home");
  const [toast,     setToast]     = useState<string | null>(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (id: string, nav: string) => {
    setActiveNav(nav);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showToast = (msg: string) => { setToast(null); setTimeout(() => setToast(msg), 50); };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-shadow duration-300
                      border-b border-green-200 ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-[1200px] mx-auto h-16 flex items-center justify-between px-5 md:px-7">

          {/* Logo */}
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(77,158,138,0.28)]
                            group-hover:scale-105 transition-transform flex-shrink-0">
              <Image src="/dished-icon.png" width={36} height={36} alt="Dished" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <div className="font-serif font-black text-xl text-gray-900 leading-none">Dished</div>
              <div className="text-[9.5px] text-green-600 font-bold tracking-widest uppercase">
                Canada&apos;s Home Kitchen
              </div>
            </div>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ label, id }) => {
              const nav = id.replace("-section", "");
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id, nav)}
                  className={`px-3.5 py-2 rounded-xl text-[13.5px] font-semibold transition-all duration-200
                    ${activeNav === nav
                      ? "bg-green-100 text-green-800"
                      : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                    }`}
                >
                  {label}
                </button>
              );
            })}

            <div className="w-px h-4 bg-gray-200 mx-1.5" />

            <button
              onClick={() => showToast("Chef registration is coming soon — stay tuned!")}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13.5px] font-semibold
                         bg-green-50 text-green-700 border border-green-200 cursor-pointer
                         hover:bg-green-100 transition-colors"
            >
              Become a Chef
              <span className="text-[9px] font-black text-white bg-green-600 px-1.5 py-0.5
                               rounded-full uppercase tracking-wide leading-none">
                Soon
              </span>
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-600
                       hover:bg-green-50 hover:text-green-700 transition-colors"
          >
            {menuOpen ? <XIcon size={20} /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-green-100 bg-white/98 backdrop-blur-md
                          px-5 pt-3 pb-5 flex flex-col gap-1 animate-slide-down">
            {NAV_ITEMS.map(({ label, id }) => {
              const nav = id.replace("-section", "");
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id, nav)}
                  className={`px-4 py-3 rounded-xl text-[14px] font-semibold text-left
                              transition-all duration-200
                              ${activeNav === nav
                                ? "bg-green-50 text-green-800"
                                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                              }`}
                >
                  {label}
                </button>
              );
            })}

            <div className="h-px bg-gray-100 my-2" />

            <button
              onClick={() => { setMenuOpen(false); showToast("Chef registration is coming soon — stay tuned!"); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                         bg-green-50 text-green-700 font-semibold text-[14px] border border-green-200"
            >
              Become a Chef
              <span className="text-[9px] font-black text-white bg-green-600 px-1.5 py-0.5
                               rounded-full uppercase tracking-wide leading-none">
                Soon
              </span>
            </button>
          </div>
        )}
      </nav>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
