/**
 * Role storytelling content — plain TS module (no "use client" directive) so
 * both server components (e.g. /how-it-works/[role]/page.tsx) and the
 * client-side <StoryHeader /> can import the data without crossing the
 * React Server Components serialization boundary.
 */

export type StoryContent = {
  eyebrow: string;
  mission: string;
  missionTail?: string;
  utilities: string[];
};

export const STORY_BY_ROLE: Record<"cook" | "foodie" | "delivery", StoryContent> = {
  cook: {
    eyebrow: "For Chefs · The Mission",
    mission: "Your passion deserves a stage.",
    missionTail: "We removed the rent wall.",
    utilities: ["Flexible hours", "Zero overhead", "Hot Line surplus", "Reputation builder"],
    
  },
  foodie: {
    eyebrow: "For Guests · The Mission",
    mission: "Taste the kitchens your city hides.",
    missionTail: "A seat at the neighbourhood table, any night of the week.",
    utilities: ["Hand-curated chefs", "Cultural variety", "Hot Line deals", "Real stories, real meals"],
  },
  delivery: {
    eyebrow: "For Couriers · The Mission",
    mission: "Every route is a warm welcome.",
    missionTail: "White-glove handoffs, fairly paid.",
    utilities: ["Flexible hours", "Transparent pay", "Hot Line priority", "Five-star reputation"],
  },
};
