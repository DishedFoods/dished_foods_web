import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RoleStory } from "@/components/sections/RoleStory";
import { StoryHeader } from "@/components/sections/StoryHeader";
import { STORY_BY_ROLE } from "@/components/sections/storyContent";
import { HotLineSurplus } from "@/components/sections/HotLineSurplus";
import { DishedFeedPreview } from "@/components/sections/DishedFeedPreview";
import { ChefManifesto } from "@/components/sections/ChefManifesto";
import { FoodieManifesto } from "@/components/sections/FoodieManifesto";
import { RoleThemeSetter } from "@/components/providers/RoleThemeSetter";
import { COOK_STEPS, FOODIE_STEPS, DELIVERY_STEPS } from "@/components/sections/roleStoryScreens";

type Role = "cook" | "foodie" | "delivery";

const ROLE_CONFIG: Record<Role, {
  title: string;
  tagline: string;
  accent: string;
  accentSolid: string;
  bg: string;
  bgGradient: string;
  backColor: string;
  backHover: string;
  steps: typeof COOK_STEPS;
  ctaLabel: string;
  ctaHref: string;
}> = {
  cook: {
    title: "Cook",
    tagline: "Your kitchen, your business. Here's how it works — step by step.",
    accent: "from-orange-500 to-red-600",
    accentSolid: "#f97316",
    bg: "bg-[#fef7f0]",
    bgGradient: "from-orange-50/80 via-red-50/40 to-amber-50/60",
    backColor: "text-orange-600/70",
    backHover: "hover:text-orange-800",
    steps: COOK_STEPS,
    ctaLabel: "Become a Cook",
    ctaHref: "/auth/cook?view=register",
  },
  foodie: {
    title: "Foodie",
    tagline: "Real home-cooked meals from real neighbours. Follow along.",
    accent: "from-green-600 to-emerald-700",
    accentSolid: "#059669",
    bg: "bg-[#f0faf5]",
    bgGradient: "from-green-50/80 via-emerald-50/40 to-teal-50/60",
    backColor: "text-emerald-600/70",
    backHover: "hover:text-emerald-800",
    steps: FOODIE_STEPS,
    ctaLabel: "Find Cooks Near Me",
    ctaHref: "/auth/foodie?view=register",
  },
  delivery: {
    title: "Delivery Partner",
    tagline: "Earn on your own schedule, delivering home-cooked meals. Here's the flow.",
    accent: "from-blue-600 to-indigo-700",
    accentSolid: "#2563eb",
    bg: "bg-[#f0f4ff]",
    bgGradient: "from-blue-50/80 via-indigo-50/40 to-sky-50/60",
    backColor: "text-blue-600/70",
    backHover: "hover:text-blue-800",
    steps: DELIVERY_STEPS,
    ctaLabel: "Start Delivering",
    ctaHref: "/auth/delivery?view=register",
  },
};

export function generateStaticParams() {
  return [{ role: "cook" }, { role: "foodie" }, { role: "delivery" }];
}

export default function HowItWorksPage({ params }: { params: { role: string } }) {
  const cfg = ROLE_CONFIG[params.role as Role];
  if (!cfg) notFound();

  const story = STORY_BY_ROLE[params.role as Role];

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Mount the role theme as soon as the page hydrates. */}
      <RoleThemeSetter role={params.role} />

      {/* Ambient theme wash pulled from --theme-glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--theme-glow, none)" }}
      />

      <div className="relative z-10">
        <Navbar />

        {/* Back link */}
        <section className="pt-28 pb-4 md:pt-36 md:pb-4 px-5">
          <div className="max-w-[1100px] mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold
                         transition-colors mb-2 group"
              style={{ color: "var(--text-muted)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                   className="group-hover:-translate-x-1 transition-transform">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to home
            </Link>
          </div>
        </section>

        {/* Role-specific manifesto replaces generic StoryHeader on cook & foodie */}
        {params.role === "cook" && <ChefManifesto />}
        {params.role === "foodie" && <FoodieManifesto />}
        {params.role === "delivery" && <StoryHeader content={story} />}

        {/* Interactive story */}
        <RoleStory
          role={cfg.title}
          accent={cfg.accent}
          accentSolid={cfg.accentSolid}
          steps={cfg.steps}
          ctaLabel={cfg.ctaLabel}
          ctaHref={cfg.ctaHref}
        />

        {/* Dished Feed — Instagram-style vertical scroll preview */}
        <DishedFeedPreview />

        {/* Hot Line surplus — chef-only feature */}
        {params.role === "cook" && <HotLineSurplus />}

        <Footer />
      </div>
    </main>
  );
}
