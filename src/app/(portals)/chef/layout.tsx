"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

/* ── Nav items ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: "Home",
    href: "/chef/home",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Dashboard",
    href: "/chef/dashboard",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/chef/profile",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/chef/orders",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Menu",
    href: "/chef/menu",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
  },
];

/* ── User avatar ───────────────────────────────────────────── */
function UserAvatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-green-400 to-green-600
                 flex items-center justify-center text-white font-bold flex-shrink-0"
    >
      <span style={{ fontSize: size * 0.38 }}>{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const { count: cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [signingOut,   setSigningOut]   = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/become-a-chef");
  }, [loading, user, router]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-3 pt-6 pb-4 mb-1">
        <Link href="/chef/home" className="flex flex-col items-center xl:items-start gap-1 group">
          {/* Icon-only sidebar (< xl): centred logo, no label */}
          <div className="xl:hidden relative w-16 h-14">
            <Image src="/dished_logosvg.svg" fill alt="Dished"
              className="object-contain mix-blend-multiply" sizes="64px" />
          </div>
          {/* Wide sidebar (xl+): bigger logo */}
          <div className="hidden xl:flex flex-col items-center gap-1.5 w-full">
            <div className="relative w-52 h-24">
              <Image src="/dished_logosvg.svg" fill alt="Dished"
                className="object-contain mix-blend-multiply" sizes="208px" />
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const active = pathname === href || (href !== "/chef/home" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 group
                         ${active ? "font-extrabold text-gray-900" : "font-normal text-gray-700 hover:bg-gray-100"}`}
            >
              <span className="flex-shrink-0">{icon(active)}</span>
              <span className="hidden xl:block text-[15px]">{label}</span>
            </Link>
          );
        })}

        {/* Cart */}
        <Link
          href="/cart"
          className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150 group
                     ${pathname === "/cart" ? "font-extrabold text-gray-900" : "font-normal text-gray-700 hover:bg-gray-100"}`}
        >
          <span className="relative flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/cart" ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth={pathname === "/cart" ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-green-600 text-white
                               text-[9px] font-bold flex items-center justify-center px-1 leading-none">
                {cartCount}
              </span>
            )}
          </span>
          <span className="hidden xl:block text-[15px]">Cart</span>
        </Link>

        {/* Admin */}
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors group"
          >
            <span className="flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <span className="hidden xl:block text-[15px]">Admin</span>
          </Link>
        )}
      </nav>

      {/* Profile + Sign Out at bottom */}
      <div className="px-2 pb-4 relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-150
                     hover:bg-gray-100 ${profileOpen ? "bg-gray-100" : ""}`}
        >
          <UserAvatar name={user.username} size={32} />
          <div className="hidden xl:flex flex-col items-start min-w-0 flex-1">
            <span className="text-[14px] font-semibold text-gray-900 truncate leading-tight w-full text-left">
              {user.username}
            </span>
            <span className="text-[11px] text-gray-400 truncate w-full text-left">{user.email}</span>
          </div>
          <span className="hidden xl:flex ml-auto text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </span>
        </button>

        {/* Profile popup */}
        {profileOpen && (
          <div className="absolute bottom-full left-2 right-2 mb-2 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)]
                          border border-gray-100 overflow-hidden z-50 animate-slide-up">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-[13px] font-bold text-gray-900">{user.username}</div>
              <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
            </div>
            <Link
              href="/chef/profile"
              className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              View Profile
            </Link>
            <button
              disabled={signingOut}
              onClick={async () => {
                setSigningOut(true);
                setProfileOpen(false);
                logout();
                await router.push("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-500 hover:bg-red-50
                         transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {signingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin flex-shrink-0" />
                  Signing out…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-30
                        w-[72px] xl:w-[244px] border-r border-gray-200 bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar — slide-in */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-[244px] z-50 bg-white border-r border-gray-200
                         transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      {/* Main content — offset for sidebar */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[72px] xl:ml-[244px]">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="relative w-20 h-12 flex-shrink-0">
            <Image src="/dished_logosvg.svg" fill alt="Dished"
              className="object-contain mix-blend-multiply" sizes="80px" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-green-600 text-white
                                 text-[9px] font-bold flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <UserAvatar name={user.username} size={32} />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
