import type { Chef } from "@/types";

export const ALL_CHEFS: Chef[] = [
  {
    id: 1,
    name: "Sarah MacDonald",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    hasStory: true,
    cuisines: ["Canadian", "East Coast", "Seafood"],
    rating: 5.0,
    reviews: 134,
    distance: 1.4,
    specialty: "Lobster Rolls & Seafood Chowder",
    province: "NS",
    price: "$$",
    badge: "Perfect Score",
    bio: "Halifax-born and sea-obsessed. I cook the East Coast classics I grew up on — fresh-caught lobster rolls, thick seafood chowder, and biscuits that actually flake.",
  },
  {
    id: 2,
    name: "Marco Rossi",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    hasStory: true,
    cuisines: ["Italian", "Mediterranean", "Pasta"],
    rating: 4.9,
    reviews: 218,
    distance: 0.9,
    specialty: "Hand-rolled Pasta & Ragù",
    province: "ON",
    price: "$$",
    badge: "Top Chef",
    bio: "Nonna taught me to roll pasta before I could ride a bike. Every sauce I make simmers for hours — no shortcuts, no jars, just patience and good tomatoes.",
  },
  {
    id: 3,
    name: "Amélie Tremblay",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    hasStory: true,
    cuisines: ["Québécois", "French", "Comfort"],
    rating: 4.8,
    reviews: 176,
    distance: 0.7,
    specialty: "Tourtière & Poutine",
    province: "QC",
    price: "$",
    badge: "Fan Favourite",
    bio: "Montréal kitchen, Québécois recipes passed down four generations. My tourtière uses the exact spice blend my great-grand-mère swore by.",
  },
  {
    id: 4,
    name: "James Whitehorse",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    hasStory: false,
    cuisines: ["Indigenous", "Bannock", "Wild Game"],
    rating: 4.7,
    reviews: 109,
    distance: 1.8,
    specialty: "Bison Stew & Fresh Bannock",
    province: "MB",
    price: "$",
    badge: "Most Ordered",
    bio: "Cree roots, cooking the foods of my ancestors — wild bison, three-sisters stew, bannock hot from the pan. Everything made with land-first ingredients.",
  },
  {
    id: 5,
    name: "Chloe Anderson",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
    hasStory: true,
    cuisines: ["Modern Canadian", "Farm-to-Table", "Vegetarian"],
    rating: 4.9,
    reviews: 87,
    distance: 2.3,
    specialty: "Seasonal Bowls & Prairie Grains",
    province: "AB",
    price: "$$",
    badge: "New Chef",
    bio: "Calgary home kitchen built around whatever's fresh at the farmers market this week. Big flavours, prairie ingredients, zero pretense.",
  },
  {
    id: 6,
    name: "David Okafor",
    photo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&crop=face",
    hasStory: false,
    cuisines: ["West African", "Jollof", "Grill"],
    rating: 4.8,
    reviews: 94,
    distance: 1.1,
    specialty: "Jollof Rice & Suya Skewers",
    province: "ON",
    price: "$$",
    badge: null,
    bio: "Ottawa-based, Lagos-trained. My jollof gets the party started and my suya spice blend is ground fresh every weekend.",
  },
];

export const CUISINE_FILTERS = [
  "All", "Canadian", "Italian", "Québécois",
  "Indigenous", "Farm-to-Table", "West African", "Seafood",
];

export const SORT_OPTIONS: readonly string[] = [
  "Nearest", "Top Rated", "Most Reviews", "Price: Low", "Price: High",
];

export const CANADIAN_PROVINCES = [
  "ON",//"BC","QC","AB","MB","SK","NS","NB","NL","PE",
];

export const GALLERY_PHOTOS = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
];

export const HERO_FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
];
