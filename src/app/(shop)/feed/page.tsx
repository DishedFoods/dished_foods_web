"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { FeedPost, FeedComment } from "@/types";

const FEED_KEY = "dished_feed_posts";

/* ── Category config ─────────────────────────────────────── */
const CATEGORY_CONFIG: Record<string, { gradient: string; bg: string; dot: string }> = {
  "Appetizer":    { gradient: "from-orange-400 to-amber-300",   bg: "bg-orange-50",  dot: "bg-orange-400" },
  "Main Course":  { gradient: "from-green-500 to-teal-400",     bg: "bg-green-50",   dot: "bg-green-500"  },
  "Dessert":      { gradient: "from-pink-400 to-rose-300",      bg: "bg-pink-50",    dot: "bg-pink-400"   },
  "Beverage":     { gradient: "from-blue-400 to-cyan-300",      bg: "bg-blue-50",    dot: "bg-blue-400"   },
  "Soup":         { gradient: "from-yellow-500 to-amber-400",   bg: "bg-yellow-50",  dot: "bg-yellow-500" },
  "Salad":        { gradient: "from-lime-400 to-green-300",     bg: "bg-lime-50",    dot: "bg-lime-500"   },
  "Side Dish":    { gradient: "from-violet-400 to-purple-300",  bg: "bg-violet-50",  dot: "bg-violet-400" },
  "Snack":        { gradient: "from-orange-500 to-red-400",     bg: "bg-orange-50",  dot: "bg-orange-500" },
  "Bread":        { gradient: "from-amber-400 to-yellow-300",   bg: "bg-amber-50",   dot: "bg-amber-400"  },
  "Other":        { gradient: "from-gray-400 to-slate-300",     bg: "bg-gray-50",    dot: "bg-gray-400"   },
};
const DEFAULT_CAT = { gradient: "from-green-400 to-teal-300", bg: "bg-green-50", dot: "bg-green-400" };

function getCat(cat: string) { return CATEGORY_CONFIG[cat] ?? DEFAULT_CAT; }

/* ── Helpers ─────────────────────────────────────────────── */
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

/* ── Chef avatar ─────────────────────────────────────────── */
function ChefAvatar({ name, size = 40, className = "" }: { name: string; size?: number; className?: string }) {
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
                  text-white font-bold flex-shrink-0 ${className}`}
    >
      <span style={{ fontSize: size * 0.38 }}>{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

/* ── Stories bar ─────────────────────────────────────────── */
function StoriesBar({ posts }: { posts: FeedPost[] }) {
  // One story bubble per unique chef (most recent post wins)
  const seen = new Set<number>();
  const chefs: FeedPost[] = [];
  [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).forEach((p) => {
    if (!seen.has(p.cookId)) { seen.add(p.cookId); chefs.push(p); }
  });
  if (!chefs.length) return null;
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-3 scrollbar-hide">
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

/* ── Post card ───────────────────────────────────────────── */
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
  const [commentText, setCommentText] = useState("");
  const [heartAnim, setHeartAnim] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const isLiked = currentUsername ? post.likes.includes(currentUsername) : false;
  const cat = getCat(post.category);

  const handleDoubleTap = () => {
    if (!currentUsername) return;
    if (!isLiked) {
      onLike(post.id);
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 900);
    }
  };

  const handleComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUsername) return;
    onComment(post.id, commentText.trim());
    setCommentText("");
  };

  const isExpired = !!post.expiresAt && new Date(post.expiresAt) <= new Date();

  const handleCart = () => {
    onAddToCart(post);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden
                        shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <ChefAvatar name={post.cookDisplayName || post.cookUsername} size={38} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13.5px] font-bold text-gray-900">{post.cookDisplayName || post.cookUsername}</span>
              {post.available && !isExpired && (
                <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                  Open
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-400">
              {[post.neighbourhood, post.city, post.province].filter(Boolean).join(", ") || "Canada"} · {timeAgo(post.createdAt)}
            </div>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${cat.dot}`} />
      </div>

      {/* Image / gradient */}
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ aspectRatio: "4/3" }}
        onDoubleClick={handleDoubleTap}
      >
        {post.imageUrl ? (
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 600px) 100vw, 560px" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cat.gradient} flex flex-col items-center justify-center gap-3`}>
            <span className="text-white/30 font-serif font-black text-7xl leading-none select-none">
              {post.title.charAt(0).toUpperCase()}
            </span>
            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{post.category}</span>
          </div>
        )}
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full
                        shadow-sm text-[13px] font-black text-gray-900">
          ${post.price.toFixed(2)}
        </div>
        {/* Double-tap heart */}
        {heartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"
                 className="text-white drop-shadow-lg animate-ping" style={{ animationDuration: "0.6s" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-1">
        {/* Like */}
        <button
          onClick={() => { if (currentUsername) onLike(post.id); }}
          disabled={!currentUsername}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold
                     transition-all duration-200 cursor-pointer
                     ${isLiked
                       ? "text-red-500 bg-red-50"
                       : "text-gray-500 hover:text-red-400 hover:bg-red-50"
                     }
                     disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
               fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{post.likes.length}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold
                     text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{post.comments.length}</span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add to cart */}
        {post.available && !isExpired && (
          <button
            onClick={handleCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                       transition-all duration-300 cursor-pointer
                       ${addedToCart
                         ? "bg-green-600 text-white shadow-[0_4px_12px_rgba(77,158,138,0.4)]"
                         : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white hover:border-transparent hover:shadow-[0_4px_12px_rgba(77,158,138,0.3)]"
                       }`}
          >
            {addedToCart ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
              </>
            )}
          </button>
        )}
        {!post.available && (
          <span className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 bg-gray-100">
            Unavailable
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pb-3">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[14px] font-bold text-gray-900">{post.title}</span>
          {post.servings && (
            <span className="text-[11px] text-gray-400">· {post.servings} serving{post.servings > 1 ? "s" : ""}</span>
          )}
        </div>
        {post.description && (
          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{post.description}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((t) => (
              <span key={t} className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}
        {!currentUsername && (
          <p className="mt-2 text-[11px] text-gray-400">
            <Link href="/auth/cook?view=login" className="text-green-600 font-semibold hover:underline">Sign in</Link> to like, comment & order
          </p>
        )}
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-2.5 bg-gray-50/50">
          {post.comments.length === 0 && (
            <p className="text-[12px] text-gray-400 text-center py-1">No comments yet. Be the first!</p>
          )}
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-2.5">
              <ChefAvatar name={c.authorName} size={26} />
              <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-gray-100">
                <span className="text-[12px] font-bold text-gray-800 mr-1.5">{c.authorName}</span>
                <span className="text-[12px] text-gray-600">{c.text}</span>
                <div className="text-[10px] text-gray-400 mt-0.5">{timeAgo(c.createdAt)}</div>
              </div>
            </div>
          ))}
          {currentUsername && (
            <form onSubmit={handleComment} className="flex gap-2 pt-1">
              <ChefAvatar name={currentUsername} size={28} />
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[13px]
                           outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
              <button type="submit" disabled={!commentText.trim()}
                className="px-3 py-1.5 bg-green-600 text-white text-[12px] font-bold rounded-xl
                           hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

/* ── Filter bar ──────────────────────────────────────────── */
type FeedFilter = "recent" | "trending" | "nearby";

function FilterBar({ active, onChange }: { active: FeedFilter; onChange: (f: FeedFilter) => void }) {
  const tabs: { id: FeedFilter; label: string }[] = [
    { id: "recent",   label: "Recent"   },
    { id: "trending", label: "Trending" },
    { id: "nearby",   label: "Nearby"   },
  ];
  return (
    <div className="flex gap-2 px-4 py-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer
            ${active === t.id
              ? "bg-green-600 text-white shadow-[0_2px_8px_rgba(77,158,138,0.35)]"
              : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-700"
            }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────── */
function EmptyFeed() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4d9e8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
      </div>
      <h3 className="font-serif font-black text-xl text-gray-900 mb-2">The feed is empty</h3>
      <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed mb-6">
        Home chefs haven&apos;t posted any dishes yet. Are you a chef? Be the first to share!
      </p>
      <Link
        href="/auth/cook?view=register"
        className="px-5 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-xl
                   hover:bg-green-700 transition-colors shadow-[0_4px_12px_rgba(77,158,138,0.3)]"
      >
        Join as a Chef
      </Link>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function FeedPage() {
  const { user } = useAuth();
  const { addToCart, count: cartCount } = useCart();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [filter, setFilter] = useState<FeedFilter>("recent");
  const [mounted, setMounted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

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
        return {
          ...p,
          likes: liked
            ? p.likes.filter((u) => u !== user.username)
            : [...p.likes, user.username],
        };
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
      const next = prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
      );
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

  const sortedPosts = [...posts].sort((a, b) => {
    if (filter === "trending") return b.likes.length - a.likes.length;
    if (filter === "nearby")   return Math.random() - 0.5; // placeholder
    return b.createdAt.localeCompare(a.createdAt); // recent
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-green-100
                         shadow-[0_1px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-[560px] mx-auto h-14 flex items-center justify-between px-4">
          <Link href={user ? "/chef/home" : "/"} className="group flex-shrink-0">
            <div className="relative h-8 w-[46px]">
              <Image src="/dished_logo1.png" alt="Dished" fill priority className="object-contain mix-blend-multiply" sizes="46px" />
            </div>
          </Link>

          <h1 className="font-serif font-black text-lg text-gray-900">Feed</h1>

          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-xl
                                          text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] h-[18px] rounded-full
                                 bg-green-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Chef post link */}
            {user && (
              <Link href="/chef/posts"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 text-white
                           text-xs font-bold hover:bg-green-700 transition-colors cursor-pointer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Post
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[560px] mx-auto" ref={topRef}>
        {/* Stories */}
        <div className="bg-white border-b border-gray-100">
          <StoriesBar posts={posts} />
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-100">
          <FilterBar active={filter} onChange={setFilter} />
        </div>

        {/* Feed */}
        <div className="py-3 px-3 flex flex-col gap-4">
          {sortedPosts.length === 0 ? (
            <EmptyFeed />
          ) : (
            sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUsername={user?.username ?? null}
                onLike={handleLike}
                onComment={handleComment}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>

        {sortedPosts.length > 0 && (
          <div className="py-8 text-center text-xs text-gray-400 font-medium">
            You&apos;ve seen all posts &mdash;{" "}
            <button onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="text-green-600 font-semibold hover:underline cursor-pointer">
              Back to top
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
