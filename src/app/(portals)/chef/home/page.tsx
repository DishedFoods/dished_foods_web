"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { FeedPost, FeedComment } from "@/types";

const FEED_KEY = "dished_feed_posts";

/* ── Lightbox ────────────────────────────────────────────────── */
function MediaLightbox({ src, type, onClose }: { src: string; type: "image" | "video"; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
                   text-white flex items-center justify-center transition-colors cursor-pointer z-10">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div className="max-w-3xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {type === "video" ? (
          <video src={src} className="w-full max-h-[90vh] rounded-xl" controls autoPlay />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="Media" className="w-full max-h-[90vh] object-contain rounded-xl" />
        )}
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
const CATEGORY_CONFIG: Record<string, { gradient: string; dot: string }> = {
  "Appetizer":   { gradient: "from-orange-400 to-amber-300",  dot: "bg-orange-400"  },
  "Main Course": { gradient: "from-green-500 to-teal-400",    dot: "bg-green-500"   },
  "Dessert":     { gradient: "from-pink-400 to-rose-300",     dot: "bg-pink-400"    },
  "Beverage":    { gradient: "from-blue-400 to-cyan-300",     dot: "bg-blue-400"    },
  "Soup":        { gradient: "from-yellow-500 to-amber-400",  dot: "bg-yellow-500"  },
  "Salad":       { gradient: "from-lime-400 to-green-300",    dot: "bg-lime-500"    },
  "Side Dish":   { gradient: "from-violet-400 to-purple-300", dot: "bg-violet-400"  },
  "Snack":       { gradient: "from-orange-500 to-red-400",    dot: "bg-orange-500"  },
  "Bread":       { gradient: "from-amber-400 to-yellow-300",  dot: "bg-amber-400"   },
  "Other":       { gradient: "from-gray-400 to-slate-300",    dot: "bg-gray-400"    },
};
const DEFAULT_CAT = { gradient: "from-green-400 to-teal-300", dot: "bg-green-400" };
const getCat = (cat: string) => CATEGORY_CONFIG[cat] ?? DEFAULT_CAT;

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function loadPosts(): FeedPost[] {
  try { return JSON.parse(localStorage.getItem(FEED_KEY) ?? "[]"); } catch { return []; }
}
function savePosts(posts: FeedPost[]) {
  localStorage.setItem(FEED_KEY, JSON.stringify(posts));
}

/* ── Avatar ──────────────────────────────────────────────────── */
function ChefAvatar({ name, size = 38 }: { name: string; size?: number }) {
  const colors = [
    "from-green-400 to-teal-500",
    "from-orange-400 to-amber-500",
    "from-blue-400 to-indigo-500",
    "from-pink-400 to-rose-500",
    "from-violet-400 to-purple-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center
                  text-white font-bold flex-shrink-0`}
    >
      <span style={{ fontSize: size * 0.38 }}>{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

/* ── Stories bar ─────────────────────────────────────────────── */
function StoriesBar({ posts }: { posts: FeedPost[] }) {
  const seen = new Set<number>();
  const chefs: FeedPost[] = [];
  [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).forEach((p) => {
    if (!seen.has(p.cookId)) { seen.add(p.cookId); chefs.push(p); }
  });
  if (!chefs.length) return null;
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-3 scrollbar-hide border-b border-gray-100">
      {chefs.map((p) => (
        <button key={p.cookId} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-green-400 via-teal-400 to-emerald-500
                          group-hover:from-orange-400 group-hover:to-pink-500 transition-all duration-300">
            <div className="bg-white rounded-full p-[2px]">
              <ChefAvatar name={p.cookDisplayName || p.cookUsername} size={52} />
            </div>
          </div>
          <span className="text-[10px] font-semibold text-gray-600 max-w-[56px] truncate">
            {p.cookDisplayName || p.cookUsername}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── Post card ───────────────────────────────────────────────── */
function PostCard({
  post,
  currentUsername,
  onLike,
  onComment,
  onAddToCart,
}: {
  post: FeedPost;
  currentUsername: string | null;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onAddToCart: (post: FeedPost) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText,  setCommentText]  = useState("");
  const [lightbox,     setLightbox]     = useState(false);
  const [heartAnim,    setHeartAnim]    = useState(false);
  const [addedToCart,  setAddedToCart]  = useState(false);
  const isExpired = post.expiresAt ? new Date() > new Date(post.expiresAt) : false;
  const isLiked = currentUsername ? post.likes.includes(currentUsername) : false;
  const cat = getCat(post.category);

  const handleDoubleTap = () => {
    if (!currentUsername || isLiked) return;
    onLike(post.id);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 700);
  };

  const handleComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUsername) return;
    onComment(post.id, commentText.trim());
    setCommentText("");
  };

  const handleCart = () => {
    onAddToCart(post);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <article className="bg-white border-b border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <ChefAvatar name={post.cookDisplayName || post.cookUsername} size={38} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-gray-900">{post.cookDisplayName || post.cookUsername}</span>
              {post.available && (
                <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                  Open
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-400">
              {[post.neighbourhood, post.city].filter(Boolean).join(", ") || "Canada"} · {timeAgo(post.createdAt)}
            </div>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${cat.dot}`} />
      </div>

      {/* Lightbox */}
      {lightbox && post.imageUrl && (
        <MediaLightbox
          src={post.imageUrl}
          type={post.mediaType ?? "image"}
          onClose={() => setLightbox(false)}
        />
      )}

      {/* Media (tap = lightbox, double-tap = like) */}
      <div
        className="relative w-full select-none cursor-pointer"
        style={{ aspectRatio: "1/1" }}
        onClick={() => { if (post.imageUrl) setLightbox(true); }}
        onDoubleClick={(e) => { e.stopPropagation(); handleDoubleTap(); }}
      >
        {post.imageUrl ? (
          post.mediaType === "video" ? (
            <video src={post.imageUrl} className="w-full h-full object-cover"
              muted playsInline loop autoPlay />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          )
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cat.gradient} flex flex-col items-center justify-center gap-3`}>
            <span className="text-white/30 font-serif font-black text-8xl leading-none">
              {post.title.charAt(0).toUpperCase()}
            </span>
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{post.category}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white
                        text-[13px] font-black px-3 py-1 rounded-full">
          ${post.price.toFixed(2)}
        </div>
        {heartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width="90" height="90" viewBox="0 0 24 24" fill="white"
                 className="drop-shadow-lg animate-ping" style={{ animationDuration: "0.6s" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 flex items-center gap-1">
        <button
          onClick={() => { if (currentUsername) onLike(post.id); }}
          disabled={!currentUsername}
          className={`flex items-center gap-1.5 p-2 rounded-full transition-all cursor-pointer
                     ${isLiked ? "text-red-500" : "text-gray-800 hover:text-red-400"}
                     disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24"
               fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button
          onClick={() => setShowComments((s) => !s)}
          className="p-2 rounded-full text-gray-800 hover:text-blue-500 transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
        <div className="flex-1" />
        {isExpired ? (
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-red-500 border border-red-200 bg-red-50">
            Expired
          </span>
        ) : post.available ? (
          <button
            onClick={handleCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold
                       transition-all duration-300 cursor-pointer
                       ${addedToCart
                         ? "bg-green-600 text-white"
                         : "border border-gray-300 text-gray-800 hover:bg-green-600 hover:text-white hover:border-transparent"}`}
          >
            {addedToCart ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Order
              </>
            )}
          </button>
        ) : (
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-400 border border-gray-200">
            Unavailable
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pb-1 mt-2">
        <div className="text-[13.5px] font-semibold text-gray-900">
          <span className="font-bold">{post.cookDisplayName || post.cookUsername}</span>{" "}
          <span className="font-normal text-gray-700">{post.title}</span>
        </div>
        {post.likes.length > 0 && (
          <div className="text-[12px] text-gray-500 mt-0.5">{post.likes.length} like{post.likes.length !== 1 ? "s" : ""}</div>
        )}
        {post.description && (
          <p className="text-[13px] text-gray-500 mt-0.5 line-clamp-2">{post.description}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {post.tags.map((t) => (
              <span key={t} className="text-[12px] text-teal-600">#{t}</span>
            ))}
          </div>
        )}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments((s) => !s)}
            className="text-[12px] text-gray-400 mt-1 cursor-pointer hover:text-gray-600"
          >
            View all {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
          </button>
        )}
        {!currentUsername && (
          <p className="mt-1 text-[11px] text-gray-400">
            <Link href="/auth/cook?view=login" className="text-green-600 font-semibold hover:underline">Sign in</Link>{" "}
            to like, comment & order
          </p>
        )}
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-3 mt-2 space-y-2">
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-2.5 items-start">
              <ChefAvatar name={c.authorName} size={26} />
              <div className="flex-1">
                <span className="text-[13px] font-bold text-gray-800 mr-1.5">{c.authorName}</span>
                <span className="text-[13px] text-gray-600">{c.text}</span>
                <div className="text-[10px] text-gray-400 mt-0.5">{timeAgo(c.createdAt)}</div>
              </div>
            </div>
          ))}
          {currentUsername && (
            <form onSubmit={handleComment} className="flex gap-2 pt-1 border-t border-gray-100 mt-2">
              <ChefAvatar name={currentUsername} size={26} />
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 text-[13px] outline-none placeholder:text-gray-400 text-gray-800"
              />
              <button type="submit" disabled={!commentText.trim()}
                className="text-[13px] font-bold text-green-600 hover:text-green-700 disabled:opacity-40 cursor-pointer">
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

/* ── Nearby chefs grid (Discover tab side panel) ─────────────── */
function NearbyChefs({ posts }: { posts: FeedPost[] }) {
  const seen = new Set<number>();
  const chefs: FeedPost[] = [];
  [...posts].sort(() => Math.random() - 0.5).forEach((p) => {
    if (!seen.has(p.cookId)) { seen.add(p.cookId); chefs.push(p); }
  });
  if (!chefs.length) return null;
  return (
    <div className="border-t border-gray-100 mt-2 pt-4 px-4">
      <h3 className="text-[13px] font-bold text-gray-900 mb-3">Nearby Chefs</h3>
      <div className="flex flex-col gap-3">
        {chefs.slice(0, 6).map((p) => (
          <div key={p.cookId} className="flex items-center gap-3">
            <ChefAvatar name={p.cookDisplayName || p.cookUsername} size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-gray-900 truncate">{p.cookDisplayName || p.cookUsername}</div>
              <div className="text-[11px] text-gray-400 truncate">
                {[p.neighbourhood, p.city].filter(Boolean).join(", ") || "Canada"}
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${getCat(p.category).dot} flex-shrink-0`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────────── */
function EmptyState({ myFeed }: { myFeed?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
      </div>
      {myFeed ? (
        <>
          <p className="text-[15px] font-bold text-gray-900 mb-1">No posts yet</p>
          <p className="text-[13px] text-gray-400 mb-5">Share your first dish with the community.</p>
          <Link href="/chef/posts"
            className="px-5 py-2.5 bg-green-600 text-white text-[13px] font-bold rounded-full
                       hover:bg-green-700 transition-colors">
            Create Post
          </Link>
        </>
      ) : (
        <>
          <p className="text-[15px] font-bold text-gray-900 mb-1">Feed is empty</p>
          <p className="text-[13px] text-gray-400 mb-5">No dishes have been posted yet.</p>
          <Link href="/chef/posts"
            className="px-5 py-2.5 bg-green-600 text-white text-[13px] font-bold rounded-full
                       hover:bg-green-700 transition-colors">
            Post a Dish
          </Link>
        </>
      )}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
type Tab = "discover" | "my-feed";

export default function ChefHomePage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [posts,   setPosts]   = useState<FeedPost[]>([]);
  const [tab,     setTab]     = useState<Tab>("discover");
  const [filter,  setFilter]  = useState<"recent" | "trending">("recent");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPosts(loadPosts());
    setMounted(true);
  }, []);

  const handleLike = useCallback((postId: string) => {
    if (!user) return;
    setPosts((prev) => {
      const next = prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likes.includes(user.username);
        return { ...p, likes: liked ? p.likes.filter((u) => u !== user.username) : [...p.likes, user.username] };
      });
      savePosts(next);
      return next;
    });
  }, [user]);

  const handleComment = useCallback((postId: string, text: string) => {
    if (!user) return;
    const comment: FeedComment = {
      id: crypto.randomUUID(),
      authorId: String(user.id),
      authorName: user.username,
      text,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => {
      const next = prev.map((p) => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p);
      savePosts(next);
      return next;
    });
  }, [user]);

  const handleAddToCart = useCallback((post: FeedPost) => {
    addToCart({
      postId: post.id,
      cookId: post.cookId,
      cookUsername: post.cookUsername,
      cookDisplayName: post.cookDisplayName,
      menuItemId: post.menuItemId,
      name: post.title,
      price: post.price,
      quantity: 1,
      category: post.category,
      imageUrl: post.imageUrl,
    });
  }, [addToCart]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  const discoverPosts = [...posts].sort((a, b) =>
    filter === "trending" ? b.likes.length - a.likes.length : b.createdAt.localeCompare(a.createdAt)
  );
  const myPosts = posts.filter((p) => p.cookId === user?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const displayPosts = tab === "my-feed" ? myPosts : discoverPosts;

  return (
    // Negative margin to cancel the layout's p-5/p-8 padding so the feed stays full-width
    <div className="-m-5 lg:-m-8 max-w-[640px] lg:mx-auto min-h-screen bg-white">
      {/* Sticky tab bar */}
      <div className="sticky top-0 lg:top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setTab("discover")}
            className={`flex-1 py-3.5 text-[14px] font-semibold transition-colors cursor-pointer relative
                       ${tab === "discover" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            Discover
            {tab === "discover" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gray-900 rounded-full" />}
          </button>
          <button
            onClick={() => setTab("my-feed")}
            className={`flex-1 py-3.5 text-[14px] font-semibold transition-colors cursor-pointer relative
                       ${tab === "my-feed" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
          >
            My Posts
            {tab === "my-feed" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gray-900 rounded-full" />}
          </button>
        </div>

        {/* Sub-filters for Discover */}
        {tab === "discover" && (
          <div className="flex items-center gap-2 px-4 pb-3 pt-1">
            <button
              onClick={() => setFilter("recent")}
              className={`px-3.5 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer
                         ${filter === "recent" ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}
            >
              Recent
            </button>
            <button
              onClick={() => setFilter("trending")}
              className={`px-3.5 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer
                         ${filter === "trending" ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"}`}
            >
              Trending
            </button>
            <div className="flex-1" />
            <Link href="/chef/posts"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-600 text-white text-[12px] font-bold
                         hover:bg-green-700 transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Post
            </Link>
          </div>
        )}
      </div>

      {/* Stories (Discover only) */}
      {tab === "discover" && <StoriesBar posts={posts} />}

      {/* Feed */}
      {displayPosts.length === 0 ? (
        <EmptyState myFeed={tab === "my-feed"} />
      ) : (
        <div className="divide-y divide-gray-100">
          {displayPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUsername={user?.username ?? null}
              onLike={handleLike}
              onComment={handleComment}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Nearby chefs (Discover only, after posts) */}
      {tab === "discover" && posts.length > 0 && <NearbyChefs posts={posts} />}

      {/* My feed: quick link to chef posts */}
      {tab === "my-feed" && myPosts.length > 0 && (
        <div className="py-8 text-center border-t border-gray-100">
          <Link href="/chef/posts"
            className="text-[13px] font-bold text-green-600 hover:underline">
            Manage your posts →
          </Link>
        </div>
      )}
    </div>
  );
}
