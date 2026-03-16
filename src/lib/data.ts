import type { Chef } from "@/types";

export const ALL_CHEFS: Chef[] = [
  {
    id: 1,
    name: "Priya Nair",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
    hasStory: true,
    cuisines: ["South Indian", "Kerala", "Vegetarian"],
    rating: 5.0,
    reviews: 134,
    distance: 1.4,
    specialty: "Appam, Fish Curry & Dosas",
    province: "ON",
    price: "$$",
    badge: "Perfect Score",
    bio: "Born in Thrissur, Kerala, now cooking in Mississauga. My appam batter ferments overnight, my fish curry uses kokum sourced from back home, and my dosas are the real 48-hour fermented kind.",
  },
  {
    id: 2,
    name: "Arjun Malhotra",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    hasStory: true,
    cuisines: ["Punjabi", "North Indian", "Mughlai"],
    rating: 4.9,
    reviews: 218,
    distance: 0.9,
    specialty: "Butter Chicken & Dal Makhani",
    province: "ON",
    price: "$$",
    badge: "Top Chef",
    bio: "From Amritsar to Brampton — my butter chicken slow-cooks for 6 hours and my dal makhani simmers overnight on a low flame, exactly how my mother taught me.",
  },
  {
    id: 3,
    name: "Mei Lin Zhang",
    photo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&crop=face",
    hasStory: true,
    cuisines: ["Cantonese", "Dim Sum", "Hong Kong"],
    rating: 4.8,
    reviews: 176,
    distance: 0.7,
    specialty: "Handmade Dumplings & XLB",
    province: "BC",
    price: "$",
    badge: "Fan Favourite",
    bio: "Third-generation dim sum chef from Vancouver's Chinatown. Every dumpling is folded by hand using recipes my grandmother brought from Guangdong province.",
  },
  {
    id: 4,
    name: "Wei Chen",
    photo: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop&crop=face",
    hasStory: false,
    cuisines: ["Sichuan", "Chinese Street Food"],
    rating: 4.7,
    reviews: 109,
    distance: 1.8,
    specialty: "Mapo Tofu & Dan Dan Noodles",
    province: "BC",
    price: "$",
    badge: "Most Ordered",
    bio: "Raised in Chengdu, cooking in Richmond. I source my doubanjiang from a Sichuan supplier and grind my own Sichuan peppercorns weekly — the numbing heat is the real deal.",
  },
  {
    id: 5,
    name: "Nalini Patel",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    hasStory: true,
    cuisines: ["Gujarati", "Indo-Chinese", "Fusion"],
    rating: 4.9,
    reviews: 87,
    distance: 2.3,
    specialty: "Hakka Noodles & Thali",
    province: "ON",
    price: "$$",
    badge: "New Chef",
    bio: "Gujarati roots, born in Mumbai where Indo-Chinese street food is a religion. I do a full thali one day and Hakka noodles the next — two cultures, one kitchen.",
  },
  {
    id: 6,
    name: "Tanvir Rahman",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    hasStory: false,
    cuisines: ["Bengali", "South Asian", "Multicultural"],
    rating: 4.8,
    reviews: 94,
    distance: 1.1,
    specialty: "Hilsa Fish & Biriyani",
    province: "ON",
    price: "$$",
    badge: null,
    bio: "From Dhaka to Toronto, bringing Bangladeshi home cooking to the table. My hilsa mustard curry is a family heirloom recipe and my Kacchi Biriyani is cooked dum-style — sealed pot, slow fire.",
  },
];

export const CUISINE_FILTERS = [
  "All", "South Indian", "Punjabi", "Cantonese",
  "Sichuan", "Gujarati", "Indo-Chinese", "Bengali",
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
