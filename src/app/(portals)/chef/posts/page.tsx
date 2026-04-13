"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { FeedPost, MenuItem } from "@/types";
import { loadProfileExtras, isProfileComplete } from "@/lib/profileExtras";

const FEED_KEY  = "dished_feed_posts";
const MENU_STORE_KEY = "dished_menu_items_v2";

const CATEGORIES = [
  "Appetizer", "Main Course", "Side Dish", "Dessert",
  "Snack", "Beverage", "Soup", "Salad", "Bread", "Other",
];

const CATEGORY_GRADIENT: Record<string, string> = {
  "Appetizer":   "from-orange-400 to-amber-300",
  "Main Course": "from-green-500 to-teal-400",
  "Dessert":     "from-pink-400 to-rose-300",
  "Beverage":    "from-blue-400 to-cyan-300",
  "Soup":        "from-yellow-500 to-amber-400",
  "Salad":       "from-lime-400 to-green-300",
  "Side Dish":   "from-violet-400 to-purple-300",
  "Snack":       "from-orange-500 to-red-400",
  "Bread":       "from-amber-400 to-yellow-300",
  "Other":       "from-gray-400 to-slate-300",
};

/* ── Image compression helper ────────────────────────────── */
function compressImage(file: File, maxPx = 1080, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width  * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadPosts(): FeedPost[] {
  try { return JSON.parse(localStorage.getItem(FEED_KEY) ?? "[]"); } catch { return []; }
}
function savePosts(posts: FeedPost[]) {
  localStorage.setItem(FEED_KEY, JSON.stringify(posts));
}
function loadMenuItems(cookId: number): MenuItem[] {
  try {
    const raw = localStorage.getItem(MENU_STORE_KEY);
    if (!raw) return [];
    const store = JSON.parse(raw) as Record<string, { items: MenuItem[]; savedAt: number }>;
    return store[String(cookId)]?.items ?? [];
  } catch { return []; }
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Post form defaults ──────────────────────────────────── */
const EMPTY_FORM = {
  title: "", description: "", price: "", category: "Main Course",
  imageUrl: "", neighbourhood: "", city: "", province: "", servings: "", tags: "",
  available: true, menuItemId: "", expiryHours: "10",
};

/* ── Create / Edit modal ─────────────────────────────────── */
function PostModal({
  initial,
  defaultExpiryHours = 10,
  menuItems,
  cookUsername,
  cookDisplayName,
  cookId,
  onSave,
  onClose,
}: {
  initial?: FeedPost | null;
  defaultExpiryHours?: number;
  menuItems: MenuItem[];
  cookUsername: string;
  cookDisplayName: string;
  cookId: number;
  onSave: (post: FeedPost) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(() => {
    // For new posts use the profile default expiry
    const emptyWithDefault = { ...EMPTY_FORM, expiryHours: String(defaultExpiryHours) };
    return initial
      ? {
          title:        initial.title,
          description:  initial.description,
          price:        String(initial.price),
          category:     initial.category,
          imageUrl:     initial.imageUrl ?? "",
          neighbourhood: initial.neighbourhood ?? "",
          city:         initial.city ?? "",
          province:     initial.province ?? "",
          servings:     initial.servings ? String(initial.servings) : "",
          tags:         initial.tags.join(", "),
          available:    initial.available,
          menuItemId:   initial.menuItemId ?? "",
          expiryHours:  initial.expiresAt
            ? String(Math.round((new Date(initial.expiresAt).getTime() - Date.now()) / 3600000))
            : String(defaultExpiryHours),
        }
      : emptyWithDefault;
  });
  const [error,       setError]       = useState<string | null>(null);
  const [uploading,   setUploading]   = useState(false);
  const [mediaType,   setMediaType]   = useState<"image" | "video" | null>(
    initial?.mediaType ?? (initial?.imageUrl ? "image" : null)
  );
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleMediaFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      if (file.type.startsWith("video/")) {
        // Convert to base64 so it persists (blob URLs die on navigation)
        if (file.size > 60 * 1024 * 1024) {
          setError("Video must be under 60 MB.");
          setUploading(false);
          return;
        }
        const dataUrl = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
        setForm((f) => ({ ...f, imageUrl: dataUrl }));
        setMediaType("video");
      } else {
        const dataUrl = await compressImage(file);
        setForm((f) => ({ ...f, imageUrl: dataUrl }));
        setMediaType("image");
      }
    } catch {
      setError("Could not process the file. Try a different one.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const clearMedia = () => {
    setForm((f) => ({ ...f, imageUrl: "" }));
    setMediaType(null);
  };

  const prefillFromMenu = (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;
    setForm((f) => ({
      ...f,
      menuItemId:  itemId,
      title:       item.name,
      description: item.description,
      price:       String(item.price),
      category:    item.category,
      available:   item.available,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (!form.title.trim())    { setError("Title is required"); return; }
    if (isNaN(price) || price <= 0) { setError("Enter a valid price"); return; }

    const post: FeedPost = {
      id:              initial?.id ?? crypto.randomUUID(),
      cookId,
      cookUsername,
      cookDisplayName,
      menuItemId:      form.menuItemId || undefined,
      title:           form.title.trim(),
      description:     form.description.trim(),
      price,
      category:        form.category,
      imageUrl:        form.imageUrl.trim() || undefined,
      mediaType:       form.imageUrl.trim() ? mediaType ?? "image" : undefined,
      expiresAt:       (() => {
        const h = parseFloat(form.expiryHours);
        if (!isNaN(h) && h > 0) {
          const base = initial?.expiresAt ? new Date(initial.expiresAt) : new Date();
          // For new posts, set from now; for edits, reset from now too
          const d = new Date(); d.setTime(d.getTime() + h * 3600000); return d.toISOString();
        }
        return undefined;
      })(),
      neighbourhood:   form.neighbourhood.trim() || undefined,
      city:            form.city.trim() || undefined,
      province:        form.province.trim() || undefined,
      servings:        form.servings ? parseInt(form.servings) : undefined,
      tags:            form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      available:       form.available,
      likes:           initial?.likes ?? [],
      comments:        initial?.comments ?? [],
      createdAt:       initial?.createdAt ?? new Date().toISOString(),
    };
    onSave(post);
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none
                   focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-serif font-black text-lg text-gray-900">
            {initial ? "Edit Post" : "Create Post"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick-fill from menu item */}
          {menuItems.length > 0 && !initial && (
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                Quick-fill from menu item
              </label>
              <select
                value={form.menuItemId}
                onChange={(e) => prefillFromMenu(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none
                           focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white cursor-pointer"
              >
                <option value="">— Select a menu item —</option>
                {menuItems.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} · ${m.price.toFixed(2)}</option>
                ))}
              </select>
            </div>
          )}

          {field("Dish title *", "title", "text", "e.g. Butter Chicken")}

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Tell customers what makes this dish special…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none resize-none
                         focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field("Price (CAD) *", "price", "number", "0.00")}
            {field("Servings", "servings", "number", "1")}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none
                         focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* ── Media picker ── */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
              Photo / Video
            </label>

            {/* Hidden file inputs */}
            <input ref={fileInputRef}   type="file" accept="image/*,video/*"
              className="hidden" onChange={handleMediaFile} />
            <input ref={cameraInputRef} type="file" accept="image/*,video/*" capture="environment"
              className="hidden" onChange={handleMediaFile} />

            {form.imageUrl ? (
              /* Preview */
              <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "4/3" }}>
                {mediaType === "video" ? (
                  <video src={form.imageUrl} className="w-full h-full object-cover"
                    muted playsInline autoPlay controls />
                ) : (
                  // Use plain <img> — Next.js <Image> doesn't support data: or blob: URLs
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={clearMedia}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white
                             flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ) : (
              /* Pick buttons */
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex flex-col items-center gap-2 py-5 rounded-xl border-2 border-dashed border-gray-200
                             text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50
                             transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span className="text-[12px] font-semibold">Upload file</span>
                </button>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 flex flex-col items-center gap-2 py-5 rounded-xl border-2 border-dashed border-gray-200
                             text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50
                             transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <span className="text-[12px] font-semibold">Take photo/video</span>
                </button>
              </div>
            )}
            {uploading && (
              <p className="text-[12px] text-green-600 font-medium mt-2 flex items-center gap-1.5">
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Processing…
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {field("Neighbourhood", "neighbourhood", "text", "Kensington")}
            {field("City", "city", "text", "Toronto")}
            {field("Province", "province", "text", "ON")}
          </div>

          {field("Tags (comma separated)", "tags", "text", "comfort, spicy, vegetarian")}

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
                ${form.available ? "bg-green-500" : "bg-gray-300"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200
                ${form.available ? "left-[22px]" : "left-0.5"}`} />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Available for ordering
            </span>
          </label>

          {/* Order expiry */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
              Order Expires In
            </label>
            <p className="text-[11px] text-gray-400 mb-2">After this time, customers can no longer add this post to their cart.</p>
            <div className="flex flex-wrap gap-2">
              {[2, 4, 6, 8, 10, 12, 24, 48, 72].map((h) => (
                <button key={h} type="button"
                  onClick={() => setForm((f) => ({ ...f, expiryHours: String(h) }))}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer
                    ${form.expiryHours === String(h)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"}`}>
                  {h}h
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 mt-2 font-medium">
              Expires: {(() => { const h = parseFloat(form.expiryHours); if (isNaN(h) || h <= 0) return "—"; const d = new Date(); d.setTime(d.getTime() + h * 3600000); return d.toLocaleString(); })()}
            </p>
          </div>

          {/* Category preview — only shown when no media uploaded */}
          {!form.imageUrl && (
            <div className={`rounded-xl h-20 bg-gradient-to-br ${CATEGORY_GRADIENT[form.category] ?? "from-gray-300 to-gray-400"}
                             flex items-center justify-center`}>
              <span className="text-white/50 font-serif font-black text-5xl leading-none">
                {form.title.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 font-medium flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600
                         hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-bold
                         hover:bg-green-700 transition-colors shadow-[0_4px_12px_rgba(77,158,138,0.3)] cursor-pointer">
              {initial ? "Save Changes" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Post mini-card (chef view) ──────────────────────────── */
function ChefPostCard({
  post,
  onEdit,
  onDelete,
  onToggleAvailable,
}: {
  post: FeedPost;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: () => void;
}) {
  const grad = CATEGORY_GRADIENT[post.category] ?? "from-gray-400 to-slate-300";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow">
      {/* Media strip */}
      <div className="relative h-36 overflow-hidden">
        {post.imageUrl ? (
          post.mediaType === "video" ? (
            <video src={post.imageUrl} className="w-full h-full object-cover"
              muted playsInline loop autoPlay />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          )
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
            <span className="text-white/30 font-serif font-black text-6xl leading-none">
              {post.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-[14px] leading-snug">{post.title}</h3>
          <span className="font-black text-green-700 text-[14px] flex-shrink-0">${post.price.toFixed(2)}</span>
        </div>

        <div className="text-[11px] text-gray-400 mb-3">
          {post.category} · {timeAgo(post.createdAt)}
        </div>

        <div className="flex items-center gap-3 mb-3 text-[12px] text-gray-500">
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {post.likes.length}
          </span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {post.comments.length}
          </span>
          <button
            onClick={onToggleAvailable}
            className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide cursor-pointer
              ${post.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
          >
            {post.available ? "Available" : "Paused"}
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={onEdit}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200
                       hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button onClick={onDelete}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-200
                       hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function ChefPostsPage() {
  const { user } = useAuth();
  const [posts,      setPosts]      = useState<FeedPost[]>([]);
  const [menuItems,  setMenuItems]  = useState<MenuItem[]>([]);
  const [showModal,  setShowModal]  = useState(false);
  const [editPost,   setEditPost]   = useState<FeedPost | null>(null);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    if (!user) return;
    const all = loadPosts();
    setPosts(all.filter((p) => p.cookId === user.id));
    setMenuItems(loadMenuItems(user.id));
    setMounted(true);
  }, [user]);

  const handleSave = useCallback((post: FeedPost) => {
    const all = loadPosts();
    const existing = all.findIndex((p) => p.id === post.id);
    const next = existing >= 0
      ? all.map((p) => (p.id === post.id ? post : p))
      : [post, ...all];
    savePosts(next);
    setPosts(next.filter((p) => p.cookId === user?.id));
    setShowModal(false);
    setEditPost(null);
  }, [user]);

  const handleDelete = useCallback((id: string) => {
    if (!confirm("Delete this post from the feed?")) return;
    const next = loadPosts().filter((p) => p.id !== id);
    savePosts(next);
    setPosts(next.filter((p) => p.cookId === user?.id));
  }, [user]);

  const handleToggle = useCallback((id: string) => {
    const all = loadPosts().map((p) =>
      p.id === id ? { ...p, available: !p.available } : p
    );
    savePosts(all);
    setPosts(all.filter((p) => p.cookId === user?.id));
  }, [user]);

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  const profileOk = isProfileComplete(user.id, !!posts.length || (() => {
    // Also accept if profile extras say verified
    const ex = loadProfileExtras(user.id);
    return ex.emailVerified && ex.phoneVerified;
  })());

  return (
    <>
      {/* Profile incomplete banner */}
      {!profileOk && (
        <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">Complete your profile before posting</p>
            <p className="text-xs text-amber-600 mt-0.5">You need to save your profile and verify your email &amp; phone.</p>
          </div>
          <Link href="/chef/profile"
            className="text-xs font-bold text-amber-700 underline underline-offset-2 whitespace-nowrap cursor-pointer">
            Go to Profile →
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif font-black text-xl text-gray-900">My Feed Posts</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {posts.length} post{posts.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <button
          disabled={!profileOk}
          onClick={() => { setEditPost(null); setShowModal(true); }}
          title={!profileOk ? "Complete your profile to post" : undefined}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-bold
                     rounded-xl hover:bg-green-700 transition-colors shadow-[0_4px_12px_rgba(77,158,138,0.3)] cursor-pointer
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Post
        </button>
      </div>

      {/* Stats strip */}
      {posts.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Likes",    value: posts.reduce((s, p) => s + p.likes.length, 0),    color: "text-red-500" },
            { label: "Total Comments", value: posts.reduce((s, p) => s + p.comments.length, 0), color: "text-blue-500" },
            { label: "Active Posts",   value: posts.filter((p) => p.available).length,           color: "text-green-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center
                                        shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-[11px] text-gray-400 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Post grid */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl
                        border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4d9e8a" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <h3 className="font-serif font-black text-lg text-gray-900 mb-1">No posts yet</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-[260px] leading-relaxed">
            Share your dishes with the community. Your posts appear in the public feed.
          </p>
          <button
            onClick={() => { setEditPost(null); setShowModal(true); }}
            className="px-5 py-2.5 bg-green-600 text-white font-bold text-sm rounded-xl
                       hover:bg-green-700 transition-colors cursor-pointer"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <ChefPostCard
              key={post.id}
              post={post}
              onEdit={() => { setEditPost(post); setShowModal(true); }}
              onDelete={() => handleDelete(post.id)}
              onToggleAvailable={() => handleToggle(post.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PostModal
          initial={editPost}
          defaultExpiryHours={loadProfileExtras(user.id).defaultExpiryHours}
          menuItems={menuItems}
          cookUsername={user.username}
          cookDisplayName={user.username}
          cookId={user.id}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditPost(null); }}
        />
      )}
    </>
  );
}
