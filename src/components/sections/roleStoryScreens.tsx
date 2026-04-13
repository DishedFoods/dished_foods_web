/* Phone-screen mockups rendered inside RoleStory.
   Each step uses SVG icons (no emoji). */

import Image from "next/image";
import type { StoryStep } from "./RoleStory";

/* ── SVG Icon helpers (32×32 default) ─────────────────────────── */
const Icon = ({ children, size = 32 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const CameraIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </Icon>
);

const EditIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Icon>
);

const BellIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Icon>
);

const TruckIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </Icon>
);

const DollarIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Icon>
);

const MapPinIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

const SearchIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);

const ShoppingBagIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Icon>
);

const NavigationIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </Icon>
);

const StarIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Icon>
);

const UserPlusIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </Icon>
);

const PowerIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </Icon>
);

const PackageIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
);

const CreditCardIcon = ({ size = 32 }: { size?: number }) => (
  <Icon size={size}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </Icon>
);

/* ── Shared building blocks ───────────────────────────────────── */
const StatusBar = ({ light = false }: { light?: boolean }) => (
  <div className={`h-8 flex items-center justify-between px-6 text-[10px] font-bold
                   ${light ? "text-gray-300" : "text-gray-800"}`}>
    <span>9:41</span>
    <div className="flex items-center gap-1.5">
      <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
        <rect x="0" y="6" width="2.5" height="4" rx="0.5" />
        <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" />
        <rect x="7" y="2" width="2.5" height="8" rx="0.5" />
        <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" />
      </svg>
      <span>100%</span>
    </div>
  </div>
);

const ScreenShell = ({
  title,
  children,
  bg = "bg-white",
  dark = false,
  brandColor = "#D4AF37",
}: { title: string; children: React.ReactNode; bg?: string; dark?: boolean; brandColor?: string }) => (
  <div className={`h-full flex flex-col ${bg}`}>
    <StatusBar light={dark} />
    <div className="px-5 pb-2 flex items-center gap-2.5">
      {/* Dished logo badge */}
      <div className="relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0 shadow-sm"
           style={{ border: `1.5px solid ${brandColor}22` }}>
        <Image src="/dished_logosvg.svg" alt="" fill className="object-contain" sizes="24px" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest"
             style={{ color: brandColor }}>Dished</div>
        <div className={`text-[17px] font-black mt-0.5 ${dark ? "text-gray-100" : "text-gray-900"}`}>{title}</div>
      </div>
    </div>
    <div className="flex-1 px-5 pb-5 overflow-hidden">{children}</div>
  </div>
);

/** Small photo card used in several screens */
const PhotoCard = ({ src, alt, children }: { src: string; alt: string; children?: React.ReactNode }) => (
  <div className="relative rounded-2xl overflow-hidden bg-gray-100">
    <div className="relative w-full h-28">
      <Image src={src} alt={alt} fill className="object-cover" sizes="240px" />
    </div>
    {children && <div className="p-2.5">{children}</div>}
  </div>
);

/* ── COOK story screens ───────────────────────────────────────── */
export const COOK_STEPS: StoryStep[] = [
  {
    icon: <CameraIcon />,
    title: "Snap a photo of your dish",
    narration:
      "Pull out your phone, take a beautiful photo of the meal you just cooked. We auto-enhance it for you — no studio needed.",
    bgImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80",
    screen: (
      <ScreenShell title="New Dish" bg="bg-[#1A1A1A]" dark brandColor="#D4AF37">
        <div className="relative flex-1 rounded-2xl overflow-hidden mt-2">
          <div className="relative w-full h-full min-h-[200px]">
            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"
              alt="Food photo"
              fill
              className="object-cover"
              sizes="240px"
            />
          </div>
          <div className="absolute inset-0">
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/80" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/80" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/80" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/80" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/60" />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="w-14 h-14 rounded-full border-4 border-[#D4AF37] p-1 shadow-lg
                          hover:scale-105 transition-transform cursor-pointer">
            <div className="w-full h-full rounded-full bg-[#D4AF37]" />
          </div>
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <EditIcon />,
    title: "Add details & set your price",
    narration:
      "Give it a name, list the ingredients, pick a category. Set your own price — and add a launch promo if you want your first orders to fly.",
    bgImage: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1920&q=80",
    screen: (
      <ScreenShell title="Dish details" bg="bg-[#1A1A1A]" dark brandColor="#D4AF37">
        <div className="space-y-2.5 mt-2">
          <div className="relative h-16 rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80"
              alt="Your dish"
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center px-3">
              <span className="text-[#D4AF37] text-[11px] font-bold">Looking great!</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl border border-[#333] bg-[#242424]">
            <div className="text-[9px] text-[#B8B8B0] font-bold uppercase">Name</div>
            <div className="text-[13px] font-bold text-[#F5F1E4]">Butter Chicken Bowl</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl border-2 border-[#D4AF37] bg-[#D4AF37]/10">
              <div className="text-[9px] text-[#D4AF37] font-bold uppercase">Price</div>
              <div className="text-[16px] font-black text-[#D4AF37]">$14.99</div>
            </div>
            <div className="p-2.5 rounded-xl border border-[#333] bg-[#242424]">
              <div className="text-[9px] text-[#B8B8B0] font-bold uppercase">Promo</div>
              <div className="text-[13px] font-bold text-[#D4AF37]">-20% launch</div>
            </div>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A88929]
                             text-[#1A1A1A] font-bold text-[12px] shadow-md">
            Publish dish
          </button>
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <BellIcon />,
    title: "New order rolls in",
    narration:
      "Hungry neighbours nearby see your dish and tap to order. Your phone buzzes — accept the order and start cooking.",
    bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80",
    screen: (
      <ScreenShell title="Incoming order" bg="bg-[#1A1A1A]" dark brandColor="#D4AF37">
        <div className="mt-2 p-3 rounded-2xl bg-gradient-to-br from-[#D4AF37]/15 to-[#A88929]/10
                        border-2 border-[#D4AF37]/40 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#D4AF37]">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                alt="Customer"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <div className="text-[12px] font-bold text-[#F5F1E4]">Maya K.</div>
              <div className="text-[9px] text-[#B8B8B0]">0.8 km away · Just now</div>
            </div>
            <div className="ml-auto text-[9px] font-bold text-[#1A1A1A] bg-[#D4AF37] px-2 py-0.5 rounded-full">
              NEW
            </div>
          </div>
          <div className="text-[12px] text-[#F5F1E4]/80 mb-2">2x Butter Chicken Bowl</div>
          <div className="flex items-baseline gap-1">
            <div className="text-[18px] font-black text-[#D4AF37]">$23.98</div>
            <div className="text-[10px] text-[#B8B8B0]">+ $4.50 tip</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button className="py-2.5 rounded-xl border-2 border-[#333] text-[#B8B8B0] font-bold text-[11px]">
            Decline
          </button>
          <button className="py-2.5 rounded-xl bg-[#D4AF37] text-[#1A1A1A] font-bold text-[11px] shadow-md">
            Accept
          </button>
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <TruckIcon />,
    title: "A courier picks it up",
    narration:
      "Cook the meal. A Dished delivery partner arrives at your door, you hand it over — that's it. No driving, no hassle.",
    bgImage: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1920&q=80",
    screen: (
      <ScreenShell title="Courier on the way" bg="bg-[#1A1A1A]" dark brandColor="#D4AF37">
        <div className="mt-2 flex-1 rounded-2xl bg-gradient-to-br from-[#242424] to-[#1A1A1A]
                        relative overflow-hidden p-4 border border-[#333]">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
                 backgroundSize: "14px 14px",
               }} />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            <path d="M 40 40 Q 100 80 100 100 T 160 160" stroke="#D4AF37" strokeWidth="3"
                  strokeDasharray="8 4" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="40" r="6" fill="#D4AF37" />
            <circle cx="160" cy="160" r="6" fill="#D4AF37" opacity="0.5" />
          </svg>
          {/* Home icon */}
          <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          {/* Courier icon */}
          <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center animate-bounce">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              <path d="M15 3h4l3 5v8h-5" /><rect x="1" y="3" width="14" height="13" rx="1" />
            </svg>
          </div>
        </div>
        <div className="mt-3 p-2.5 rounded-xl bg-[#242424] border border-[#333] flex items-center gap-2.5 shadow-sm">
          <div className="relative w-9 h-9 rounded-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
              alt="Courier"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-bold text-[#F5F1E4]">Ryan is 3 min away</div>
            <div className="text-[9px] text-[#B8B8B0]">Honda Civic · ABC 123</div>
          </div>
          <div className="text-[10px] font-bold text-[#D4AF37]">3 min</div>
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <DollarIcon />,
    title: "Get paid. Every. Week.",
    narration:
      "We deposit your earnings weekly — or cash out instantly. 0% commission on your first month. You cook, we handle the rest.",
    bgImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80",
    screen: (
      <ScreenShell title="This week's earnings" bg="bg-[#1A1A1A]" dark brandColor="#D4AF37">
        <div className="mt-2 p-4 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#A88929] text-[#1A1A1A] shadow-lg">
          <div className="text-[10px] font-bold uppercase opacity-70 tracking-wider">Balance</div>
          <div className="text-[32px] font-black leading-none mt-1">$847.50</div>
          <div className="text-[11px] opacity-80 mt-1">+$124 from yesterday</div>
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            ["Butter Chicken Bowl", "$23.98", "2x"],
            ["Pasta Primavera", "$31.00", "1x"],
            ["Veggie Thali", "$15.99", "3x"],
          ].map(([name, amt, qty]) => (
            <div key={name} className="flex items-center justify-between p-2.5 rounded-xl bg-[#242424] border border-[#333]">
              <div>
                <div className="text-[11px] font-bold text-[#F5F1E4]">{name}</div>
                <div className="text-[9px] text-[#B8B8B0]">{qty}</div>
              </div>
              <div className="text-[12px] font-black text-[#D4AF37]">{amt}</div>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#A88929]
                           text-[#1A1A1A] font-bold text-[12px] shadow-md">
          Cash out instantly
        </button>
      </ScreenShell>
    ),
  },
];

/* ── FOODIE story screens ─────────────────────────────────────── */
export const FOODIE_STEPS: StoryStep[] = [
  {
    icon: <MapPinIcon />,
    title: "Enter your postal code",
    narration:
      "Tell us where you are. We'll instantly surface every verified home cook in your delivery range.",
    bgImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80",
    screen: (
      <ScreenShell title="Find cooks near you" bg="bg-[#F9F8F3]" brandColor="#1B3022">
        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-[#1B3022]/8 to-[#1B3022]/15 border-2 border-[#1B3022]/25">
          <div className="text-[9px] font-bold uppercase text-[#1B3022] tracking-wider">Your postal code</div>
          <div className="text-[22px] font-black text-[#1B3022] tracking-widest mt-1">M5V 3A8</div>
        </div>
        <button className="w-full mt-3 py-3 rounded-xl bg-[#1B3022]
                           text-[#F9F8F3] font-bold text-[13px] shadow-md">
          Find Cooks
        </button>
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#1B3022]/50">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1B3022] animate-pulse" />
          24 cooks within 3 km · All verified
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <SearchIcon />,
    title: "Browse real home cooks",
    narration:
      "Swipe through dishes from your neighbours. Read their stories. See their ratings. Everything is made fresh, today.",
    bgImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80",
    screen: (
      <ScreenShell title="Cooks near you" bg="bg-[#F9F8F3]" brandColor="#1B3022">
        <div className="space-y-2 mt-2">
          {[
            { name: "Sarah M.", dish: "Lobster Rolls", rating: "5.0", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&q=80" },
            { name: "Marco R.", dish: "Hand-rolled Pasta", rating: "4.9", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=200&q=80" },
            { name: "Amelie T.", dish: "Poutine & Tourtiere", rating: "4.8", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&q=80" },
          ].map(({ name, dish, rating, img }) => (
            <div key={name} className="flex items-center gap-2.5 p-2 rounded-xl border border-[#1B3022]/12
                                       hover:border-[#1B3022]/30 hover:bg-[#1B3022]/5 transition-all cursor-pointer">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={img} alt={dish} fill className="object-cover" sizes="44px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-[#1B3022]">{name}</div>
                <div className="text-[9px] text-[#1B3022]/50 truncate">{dish}</div>
              </div>
              <div className="text-[10px] font-bold text-[#C8A96A] flex items-center gap-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#C8A96A" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {rating}
              </div>
            </div>
          ))}
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <ShoppingBagIcon />,
    title: "Place your order",
    narration:
      "Pick your dish, schedule pickup or delivery, checkout in seconds. Your cook gets notified the moment you hit confirm.",
    bgImage: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1920&q=80",
    screen: (
      <ScreenShell title="Your order" bg="bg-[#F9F8F3]" brandColor="#1B3022">
        <PhotoCard
          src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80"
          alt="Hand-rolled Bolognese"
        >
          <div className="text-[13px] font-black text-[#1B3022]">Hand-rolled Bolognese</div>
          <div className="text-[10px] text-[#1B3022]/50">by Marco R.</div>
        </PhotoCard>
        <div className="mt-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-[#1B3022]/50">Subtotal</span><span className="font-bold text-[#1B3022]">$18.99</span></div>
          <div className="flex justify-between"><span className="text-[#1B3022]/50">Delivery</span><span className="font-bold text-[#1B3022]">$3.50</span></div>
          <div className="flex justify-between text-[13px] border-t border-[#1B3022]/10 pt-2 mt-2">
            <span className="font-black text-[#1B3022]">Total</span>
            <span className="font-black text-[#1B3022]">$22.49</span>
          </div>
        </div>
        <button className="w-full mt-3 py-2.5 rounded-xl bg-[#1B3022]
                           text-[#F9F8F3] font-bold text-[12px] shadow-md">
          Place order
        </button>
      </ScreenShell>
    ),
  },
  {
    icon: <NavigationIcon />,
    title: "Track it in real-time",
    narration:
      "Watch your cook prep it and your courier bring it. You'll know exactly when to set the table.",
    bgImage: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1920&q=80",
    screen: (
      <ScreenShell title="Your meal is on the way" bg="bg-[#F9F8F3]" brandColor="#1B3022">
        <div className="relative flex-1 rounded-2xl bg-gradient-to-br from-[#1B3022]/8 to-[#C8A96A]/10
                        overflow-hidden p-4 mt-2 border border-[#1B3022]/10">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: "radial-gradient(circle, #1B3022 1px, transparent 1px)",
                 backgroundSize: "14px 14px",
               }} />
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1B3022]/15 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1B3022" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="text-[10px] font-bold text-[#1B3022] bg-[#1B3022]/10 px-2 py-0.5 rounded-full">
                Marco is cooking
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded-full bg-[#C8A96A]/25 flex items-center justify-center animate-bounce">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A96A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <div className="text-[10px] font-bold text-[#1B3022]/70 flex items-center gap-1">
                You
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 text-center p-3 rounded-xl bg-white border border-[#1B3022]/10 shadow-sm">
          <div className="text-[9px] text-[#1B3022]/40 uppercase font-bold tracking-wider">Arriving in</div>
          <div className="text-[26px] font-black text-[#1B3022]">12 min</div>
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <StarIcon />,
    title: "Taste the neighbourhood",
    narration:
      "Ring, receive, eat. Rate your cook so the next foodie knows how good you had it. That's it — real food, no chains.",
    bgImage: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1920&q=80",
    screen: (
      <ScreenShell title="How was it?" bg="bg-[#F9F8F3]" brandColor="#1B3022">
        <div className="relative w-full h-24 rounded-2xl overflow-hidden mt-2">
          <Image
            src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80"
            alt="Your meal"
            fill
            className="object-cover"
            sizes="240px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F9F8F3] via-transparent to-transparent" />
        </div>
        <div className="text-center mt-2 text-[13px] font-black text-[#1B3022]">Rate Marco&apos;s cooking</div>
        <div className="flex justify-center gap-1.5 mt-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#C8A96A" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl bg-[#1B3022]/5 border border-[#1B3022]/15 text-center">
          <div className="text-[11px] font-bold text-[#1B3022]">&quot;Best pasta outside Italy!&quot;</div>
        </div>
        <button className="w-full mt-3 py-2.5 rounded-xl bg-[#1B3022]
                           text-[#F9F8F3] font-bold text-[12px] shadow-md">
          Order again
        </button>
      </ScreenShell>
    ),
  },
];

/* ── DELIVERY story screens ───────────────────────────────────── */
export const DELIVERY_STEPS: StoryStep[] = [
  {
    icon: <UserPlusIcon />,
    title: "Sign up in minutes",
    narration:
      "Fill a quick form, verify your ID, add your vehicle. We run a background check and you're ready to roll.",
    bgImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80",
    screen: (
      <ScreenShell title="Become a partner" bg="bg-white" brandColor="#000000">
        <div className="space-y-2 mt-2">
          {[
            { l: "Full name", done: true },
            { l: "Driver's licence", done: true },
            { l: "Vehicle details", done: true },
            { l: "Background check", done: false },
          ].map(({ l, done }) => (
            <div key={l} className={`flex items-center gap-2.5 p-3 rounded-xl border transition-colors
                        ${done ? "bg-[#C47A35]/8 border-[#C47A35]/30" : "bg-gray-50 border-gray-200"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center
                              ${done ? "bg-[#000] text-white" : "bg-gray-300 text-white animate-pulse"}`}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                  </svg>
                )}
              </div>
              <div className="text-[11px] font-bold text-gray-900">{l}</div>
            </div>
          ))}
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <PowerIcon />,
    title: "Go online when you want",
    narration:
      "Tap once to start your shift. No schedules, no bosses. Work an hour or a weekend — it's up to you.",
    bgImage: "https://images.unsplash.com/photo-1449965408869-ebd13bc9e579?w=1920&q=80",
    screen: (
      <ScreenShell title="Ready to earn?" bg="bg-white" brandColor="#000000">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-[#000]
                          flex items-center justify-center shadow-2xl mb-4 cursor-pointer
                          hover:scale-105 transition-transform relative">
            <div className="text-[#C47A35] font-black text-lg tracking-wide">GO</div>
            <div className="absolute inset-0 rounded-full border-2 border-[#C47A35] animate-ping opacity-30" />
          </div>
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tap to go online</div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C47A35]" />
            14 orders near you · Avg $8.50/trip
          </div>
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <PackageIcon />,
    title: "Accept an order",
    narration:
      "A delivery pings. See the pickup, the drop-off, the payout — all upfront. Accept with one tap.",
    bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80",
    screen: (
      <ScreenShell title="New delivery" bg="bg-white" brandColor="#000000">
        <div className="mt-2 p-3.5 rounded-2xl bg-gray-50
                        border-2 border-[#000]/10 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="text-[9px] font-bold text-[#000] uppercase tracking-wider">Delivery #4721</div>
            <div className="text-[14px] font-black text-[#C47A35]">$9.50</div>
          </div>
          <div className="space-y-2.5 text-[10px]">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C47A35] ring-2 ring-[#C47A35]/20" />
              <div className="flex-1 text-gray-700"><b>Marco&apos;s Kitchen</b> · 0.4 km</div>
            </div>
            <div className="ml-[5px] w-[1px] h-4 bg-gray-300 border-l border-dashed border-gray-300" />
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#000] ring-2 ring-gray-200" />
              <div className="flex-1 text-gray-700"><b>Maya K.</b> · 2.1 km</div>
            </div>
          </div>
        </div>
        <button className="w-full mt-3 py-3 rounded-xl bg-[#000]
                           text-white font-black text-[13px] shadow-md">
          Accept delivery
        </button>
      </ScreenShell>
    ),
  },
  {
    icon: <NavigationIcon />,
    title: "Pick up & deliver",
    narration:
      "Navigate turn-by-turn to the cook, grab the meal, then drop it off. Contactless handoff, simple swipes.",
    bgImage: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1920&q=80",
    screen: (
      <ScreenShell title="En route" bg="bg-white" brandColor="#000000">
        <div className="relative flex-1 rounded-2xl bg-gray-50
                        overflow-hidden mt-2 border border-gray-200">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                 backgroundSize: "14px 14px",
               }} />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 300">
            <path d="M 30 30 Q 100 80 50 140 T 170 270" stroke="#000" strokeWidth="4"
                  fill="none" strokeLinecap="round" strokeDasharray="10 6" />
            <circle cx="30" cy="30" r="7" fill="#C47A35" />
            <circle cx="170" cy="270" r="7" fill="#000" />
          </svg>
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur shadow-sm
                          border border-gray-100">
            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Next turn</div>
            <div className="text-[13px] font-black text-[#000]">Left on King St</div>
            <div className="text-[10px] text-gray-400 mt-0.5">0.3 km · 1 min</div>
          </div>
        </div>
      </ScreenShell>
    ),
  },
  {
    icon: <CreditCardIcon />,
    title: "Cash out, rinse, repeat",
    narration:
      "Payout hits your account after every trip. Weekly, daily, or instant — you choose. Your car, your hours, your money.",
    bgImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80",
    screen: (
      <ScreenShell title="Today's earnings" bg="bg-white" brandColor="#000000">
        <div className="mt-2 p-4 rounded-2xl bg-[#000] text-white shadow-lg">
          <div className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Today</div>
          <div className="text-[32px] font-black leading-none mt-1 text-[#C47A35]">$148.20</div>
          <div className="text-[11px] opacity-70 mt-1">14 trips · 6 hrs online</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            ["TIPS", "$32"],
            ["BONUS", "$15"],
            ["BASE", "$101"],
          ].map(([label, amt]) => (
            <div key={label} className="p-2.5 rounded-xl bg-gray-50 text-center border border-gray-100">
              <div className="text-[9px] text-gray-400 font-bold tracking-wider">{label}</div>
              <div className="text-[14px] font-black text-[#000]">{amt}</div>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 py-2.5 rounded-xl bg-[#000]
                           text-[#C47A35] font-bold text-[12px] shadow-md border border-[#C47A35]/30">
          Instant cash out
        </button>
      </ScreenShell>
    ),
  },
];
