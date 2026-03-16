export interface Chef {
  id: number;
  name: string;
  photo: string;
  hasStory: boolean;
  cuisines: string[];
  rating: number;
  reviews: number;
  distance: number;
  specialty: string;
  province: string;
  price: string;
  badge: string | null;
  bio: string;
}

export type SortOption =
  | "Nearest"
  | "Top Rated"
  | "Most Reviews"
  | "Price: Low"
  | "Price: High";
