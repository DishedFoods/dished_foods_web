"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MenuIcon, XIcon } from "@/components/ui/Icons";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Toast } from "@/components/ui/Toast";

type NavItem =
  | { label: string; id: string }
  | { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "About", id: "about-section" },
  { label: "FAQ",   href: "/faq"        },
];

/* Logo: image only, no tagline.
   On dark themes (cook/hotline) mix-blend-multiply makes the logo invisible,
   so we add a CSS-variable-driven brightness invert via filter. */
function Logo() {
  return (
    <div className="flex items-center flex-shrink-0 group-hover:scale-105 transition-transform">
      <div className="relative h-16 w-[190px]">
        <Image
          src="/dished_logosvg.svg"
          alt="Dished"
          fill
          priority
          className="object-contain nav-logo"
          sizes="190px"
        />
      </div>
    </div>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const pathname = usePathname();
  const router   = useRouter();
  const isHome   = pathname === "/";
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
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-shadow duration-300
                      ${scrolled ? "shadow-[0_10px_30px_-18px_rgba(15,28,26,0.22)]" : ""}`}>
        <div className="max-w-[1200px] mx-auto h-20 flex items-center justify-between px-5 md:px-7">

          {/* Logo */}
          {user ? (
            <Link href="/chef/dashboard" className="group cursor-pointer flex-shrink-0">
              <Logo />
            </Link>
          ) : isHome ? (
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }}
              className="group cursor-pointer flex-shrink-0"
            >
              <Logo />
            </button>
          ) : (
            <Link href="/" className="group cursor-pointer flex-shrink-0">
              <Logo />
            </Link>
          )}

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              if ("href" in item) {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3.5 py-2 rounded-xl text-[13.5px] font-semibold transition-all duration-200"
                    style={{
                      color: active ? "var(--nav-active-text)" : "var(--nav-text)",
                      background: active ? "var(--nav-active-bg)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = "var(--nav-hover-text)"; e.currentTarget.style.background = "var(--nav-hover-bg)"; } }}
                    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = "var(--nav-text)"; e.currentTarget.style.background = "transparent"; } }}
                  >
                    {item.label}
                  </Link>
                );
              }
              const nav = item.id.replace("-section", "");
              const active = activeNav === nav;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id, nav)}
                  className="px-3.5 py-2 rounded-xl text-[13.5px] font-semibold transition-all duration-200"
                  style={{
                    color: active ? "var(--nav-active-text)" : "var(--nav-text)",
                    background: active ? "var(--nav-active-bg)" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = "var(--nav-hover-text)"; e.currentTarget.style.background = "var(--nav-hover-bg)"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = "var(--nav-text)"; e.currentTarget.style.background = "transparent"; } }}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="w-px h-4 mx-1.5" style={{ background: "var(--nav-divider)" }} />

            {user ? (
              <div className="flex items-center gap-2">
                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                  style={{ color: "var(--nav-text)" }}
                  aria-label="Cart"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full
                                     bg-green-600 text-white text-[9px] font-bold flex items-center justify-center px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/chef/dashboard"
                  className="px-3.5 py-2 rounded-xl text-[13.5px] font-semibold border transition-colors"
                  style={{
                    background: "var(--nav-active-bg)",
                    color: "var(--nav-active-text)",
                    borderColor: "var(--nav-divider)",
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer"
                  style={{ color: "var(--nav-text)" }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Join the Wait List — primary CTA (luxury gold) */}
                <Link
                  href="/waitlist"
                  className="px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-wide
                             text-[var(--emerald-900)]
                             bg-gradient-to-b from-[#e6c89a] to-[var(--gold)]
                             border border-[rgba(143,99,56,0.35)]
                             shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_20px_-6px_rgba(184,137,90,0.45)]
                             hover:from-[#eacfa4] hover:to-[#c29765]
                             transition-all duration-200"
                >
                  Join the Wait List
                </Link>

              </div>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            style={{ color: "var(--nav-text-bold)" }}
          >
            {menuOpen ? <XIcon size={20} /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t backdrop-blur-md px-5 pt-3 pb-5 flex flex-col gap-1 animate-slide-down"
            style={{
              background: "var(--nav-mobile-bg)",
              borderColor: "var(--nav-divider)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              if ("href" in item) {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-[14px] font-semibold text-left
                                transition-all duration-200 cursor-pointer"
                    style={{
                      color: active ? "var(--nav-active-text)" : "var(--nav-text-bold)",
                      background: active ? "var(--nav-active-bg)" : "transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              }
              const nav = item.id.replace("-section", "");
              const active = activeNav === nav;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id, nav)}
                  className="px-4 py-3 rounded-xl text-[14px] font-semibold text-left
                              transition-all duration-200 cursor-pointer"
                  style={{
                    color: active ? "var(--nav-active-text)" : "var(--nav-text-bold)",
                    background: active ? "var(--nav-active-bg)" : "transparent",
                  }}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="h-px my-2" style={{ background: "var(--nav-divider)" }} />

            {user ? (
              <>
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                             text-[14px] font-semibold transition-colors"
                  style={{ color: "var(--nav-text-bold)" }}
                >
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="flex items-center gap-1.5 text-[12px] font-bold" style={{ color: "var(--nav-active-text)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      {cartCount} in cart
                    </span>
                  )}
                </Link>
                <Link
                  href="/chef/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                             font-semibold text-[14px] border"
                  style={{
                    background: "var(--nav-active-bg)",
                    color: "var(--nav-active-text)",
                    borderColor: "var(--nav-divider)",
                  }}
                >
                  Chef Dashboard
                </Link>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[14px] font-semibold" style={{ color: "var(--nav-active-text)" }}>
                    {user.username}
                  </span>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
                    style={{ color: "var(--nav-text)" }}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/waitlist"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center px-4 py-3.5 rounded-full font-semibold text-[14px]
                             tracking-wide text-[var(--emerald-900)]
                             bg-gradient-to-b from-[#e6c89a] to-[var(--gold)]
                             border border-[rgba(143,99,56,0.35)]
                             shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_20px_-6px_rgba(184,137,90,0.45)]
                             mb-1"
                >
                  Join the Wait List
                </Link>

              </>
            )}
          </div>
        )}
      </nav>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
