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

/* ── Auth ──────────────────────────────────────────────── */

export type UserRole = "cook" | "admin";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  status: string;
  role: UserRole;
}

export type AuthView = "register" | "login" | "forgot-password";

/* ── Menu ─────────────────────────────────────────────── */

export interface MenuItem {
  id: string;
  cookId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  ingredients: string;
  notes: string;
  expiryDate: string;
  category: string;
  available: boolean;
  createdAt: string;
}

/* ── Orders ───────────────────────────────────────────── */

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

export interface Order {
  id: string;
  cookId: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notes: string;
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

/* ── Chef Dashboard ───────────────────────────────────── */

export interface ChefDashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalMenuItems: number;
  totalRevenue: number;
}

/* ── Feed ─────────────────────────────────────────────── */

export interface FeedComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  cookId: number;
  cookUsername: string;
  cookDisplayName: string;
  menuItemId?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  mediaType?: "image" | "video";
  expiresAt?: string; // ISO string — after this time cart button is disabled
  neighbourhood?: string;
  city?: string;
  province?: string;
  likes: string[];
  comments: FeedComment[];
  available: boolean;
  servings?: number;
  tags: string[];
  createdAt: string;
}

/* ── Cart ─────────────────────────────────────────────── */

export interface CartItem {
  id: string;
  postId: string;
  cookId: number;
  cookUsername: string;
  cookDisplayName: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
}
