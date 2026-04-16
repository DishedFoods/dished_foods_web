"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

/**
 * DishedFeedPreview — Instagram-style vertical scroll of food post cards.
 *
 * Renders inside the /how-it-works/[role] pages. Colors pull from the active
 * theme's CSS variables so it automatically re-skins for Cook (Midnight Bistro),
 * Foodie (Alabaster Kitchen), and Driver (Classic Dished).
 *
 * The posts are mock data — swap with real API data when the feed backend ships.
 */

interface FeedPost {
  id: string;
  chef: string;
  dish: string;
  image: string;
  likes: number;
  caption: string;
  time: string;
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    chef: "Chef Priya",
    dish: "Butter Chicken Thali",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=600&fit=crop&q=80",
    likes: 142,
    caption: "Sunday special — slow-simmered for 6 hours with fresh cream and fenugreek.",
    time: "2h ago",
  },
  {
    id: "2",
    chef: "Nonna Rosa",
    dish: "Handmade Pappardelle",
    image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=600&h=600&fit=crop&q=80",
    likes: 98,
    caption: "Fresh egg pasta with wild mushroom ragu — just like my grandmother made in Tuscany.",
    time: "4h ago",
  },
  {
    id: "3",
    chef: "Marcus T.",
    dish: "Jerk Salmon Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&q=80",
    likes: 215,
    caption: "Caribbean heat meets West Coast freshness. Mango slaw and coconut rice.",
    time: "5h ago",
  },
  {
    id: "4",
    chef: "Yuki M.",
    dish: "Matcha Mille Crêpe",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&q=80",
    likes: 176,
    caption: "20 layers of delicate crêpe with house-whisked matcha cream. Limited to 8 per day.",
    time: "6h ago",
  },
];

export function DishedFeedPreview() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.3, root: null },
    );
    el.querySelectorAll("[data-feed-card]").forEach((card) => obs.observe(card));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24 px-5 md:px-10">
      <div className="max-w-[520px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="eyebrow justify-center mb-4">The Dished Feed</div>
          <h2
            className="font-serif mb-3"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 700,
            }}
          >
            What&rsquo;s cooking now
          </h2>
          <p
            className="text-[14.5px] leading-relaxed max-w-[400px] mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Scroll through live posts from home kitchens near you — photos, menus, and limited drops.
          </p>
        </div>

        {/* Feed cards — vertical Instagram-style scroll */}
        <div ref={scrollRef} className="flex flex-col gap-5">
          {MOCK_POSTS.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              visible={visibleCards.has(`feed-${post.id}`)}
            />
          ))}
        </div>

        {/* "See more" teaser */}
        <div className="mt-8 text-center">
          <span
            className="inline-flex items-center gap-2 text-[13px] font-semibold
                       tracking-[0.12em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            <span
              className="w-8 h-px"
              style={{ background: "var(--accent)" }}
            />
            More in the app
            <span
              className="w-8 h-px"
              style={{ background: "var(--accent)" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── Individual feed card ─────────────────────────────────────────── */

function FeedCard({ post, visible }: { post: FeedPost; visible: boolean }) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      id={`feed-${post.id}`}
      data-feed-card
      className={`rounded-2xl overflow-hidden transition-all duration-700
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{
        background: "var(--surface, #ffffff)",
        border: "1px solid var(--hairline, rgba(0,0,0,0.08))",
        boxShadow: "0 8px 30px -12px rgba(0,0,0,0.12)",
      }}
    >
      {/* Card header — chef name + time */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center
                     font-serif font-bold text-sm"
          style={{
            background: "var(--accent, #D4AF37)",
            color: "var(--bg, #fff)",
          }}
        >
          {post.chef.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[13.5px] font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {post.chef}
          </p>
          <p
            className="text-[11px] tracking-wide"
            style={{ color: "var(--text-muted, #999)" }}
          >
            {post.time}
          </p>
        </div>
        {/* Overflow dots */}
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ color: "var(--text-muted, #999)" }}
        >
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </div>

      {/* Image */}
      <div className="relative aspect-square">
        <Image
          src={post.image}
          alt={post.dish}
          fill
          sizes="(max-width: 520px) 100vw, 520px"
          className="object-cover"
        />
        {/* Dished logo watermark — subtle corner badge */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                        bg-white/80 backdrop-blur-sm shadow-sm">
          <Image
            src="/dished_logosvg.svg"
            alt=""
            width={20}
            height={20}
            className="object-contain opacity-70"
            aria-hidden="true"
          />
        </div>
        {/* Dish name overlay */}
        <div className="absolute bottom-0 inset-x-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-white text-[14px] font-semibold drop-shadow-sm">
            {post.dish}
          </span>
        </div>
      </div>

      {/* Actions + caption */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-4 mb-2">
          {/* Heart */}
          <button
            onClick={() => setLiked(!liked)}
            className="transition-transform duration-200 active:scale-125"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <svg
              width="22" height="22" viewBox="0 0 24 24"
              fill={liked ? "var(--accent, #D4AF37)" : "none"}
              stroke={liked ? "var(--accent, #D4AF37)" : "currentColor"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--text-primary)" }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {/* Comment */}
          <svg
            width="21" height="21" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--text-primary)" }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {/* Share */}
          <svg
            width="21" height="21" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--text-primary)" }}
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>

        <p
          className="text-[13px] font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {post.likes + (liked ? 1 : 0)} likes
        </p>
        <p
          className="text-[13.5px] leading-relaxed mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {post.chef}
          </span>{" "}
          {post.caption}
        </p>

        {/* Order CTA */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                     text-[13px] font-semibold tracking-wide transition-all duration-200
                     hover:-translate-y-0.5 active:scale-[0.98]"
          style={{
            background: "var(--accent, #D4AF37)",
            color: "var(--bg, #fff)",
          }}
        >
          <svg
            width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Order Now
        </button>
      </div>
    </div>
  );
}
