"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type { CartItem, Order, OrderItem } from "@/types";

const ORDERS_KEY = "dished_orders";

function loadOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]"); } catch { return []; }
}

/* Group cart items by chef */
function groupByChef(items: CartItem[]) {
  const map = new Map<number, { cookUsername: string; cookDisplayName: string; items: CartItem[] }>();
  for (const item of items) {
    if (!map.has(item.cookId)) {
      map.set(item.cookId, { cookUsername: item.cookUsername, cookDisplayName: item.cookDisplayName, items: [] });
    }
    map.get(item.cookId)!.items.push(item);
  }
  return Array.from(map.values());
}

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

/* ── Item row ─────────────────────────────────────────────── */
function CartItemRow({
  item,
  onRemove,
  onQty,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onQty: (id: string, qty: number) => void;
}) {
  const grad = CATEGORY_GRADIENT[item.category] ?? "from-gray-400 to-slate-300";
  return (
    <div className="flex items-center gap-3 py-3">
      {/* Thumbnail */}
      <div className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${grad}`}>
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/40 font-serif font-black text-2xl">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[13.5px] text-gray-900 truncate">{item.name}</div>
        <div className="text-[11.5px] text-gray-400">{item.category}</div>
        <div className="font-black text-green-700 text-[13px] mt-0.5">
          ${(item.price * item.quantity).toFixed(2)}
          <span className="text-gray-400 font-normal ml-1">(${item.price.toFixed(2)} each)</span>
        </div>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onQty(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center
                     text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <span className="w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
        <button
          onClick={() => onQty(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center
                     text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors
                   flex items-center justify-center flex-shrink-0 cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

/* ── Order success overlay ────────────────────────────────── */
function OrderSuccess({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5
                      shadow-[0_0_0_8px_rgba(77,158,138,0.1)]">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4d9e8a" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 className="font-serif font-black text-2xl text-gray-900 mb-2">Order Placed!</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-[280px]">
        Your order has been sent to the chef. You&apos;ll be notified when it&apos;s confirmed.
      </p>
      <div className="flex gap-3">
        <Link href="/feed"
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600
                     hover:bg-gray-50 transition-colors cursor-pointer">
          Back to Feed
        </Link>
        <button onClick={onContinue}
          className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold
                     hover:bg-green-700 transition-colors shadow-[0_4px_12px_rgba(77,158,138,0.3)] cursor-pointer">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [name,  setName]  = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const groups = groupByChef(items);
  const TAX_RATE = 0.13; // Ontario HST
  const tax = total * TAX_RATE;
  const grandTotal = total + tax;

  const handleCheckout = () => {
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      // One order per chef
      const existing = loadOrders();
      const newOrders: Order[] = groups.map((g) => ({
        id: crypto.randomUUID(),
        cookId: g.items[0].cookId,
        customerName: name.trim(),
        customerEmail: email.trim(),
        items: g.items.map((i: CartItem): OrderItem => ({
          menuItemId: i.menuItemId ?? i.postId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        total: g.items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0),
        status: "pending",
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      }));
      localStorage.setItem(ORDERS_KEY, JSON.stringify([...newOrders, ...existing]));
      clearCart();
      setLoading(false);
      setPlaced(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-green-100
                         shadow-[0_1px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-[640px] mx-auto h-14 flex items-center gap-3 px-4">
          <Link href="/feed" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500
                                        hover:bg-green-50 hover:text-green-700 transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </Link>
          <div className="relative h-7 w-[40px]">
            <Image src="/dished_logo1.png" alt="Dished" fill priority className="object-contain" sizes="40px" />
          </div>
          <h1 className="font-serif font-black text-lg text-gray-900 flex-1">Your Cart</h1>
          {items.length > 0 && (
            <button onClick={() => clearCart()}
              className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors cursor-pointer">
              Clear all
            </button>
          )}
        </div>
      </header>

      <div className="max-w-[640px] mx-auto px-4 py-6">
        {placed ? (
          <OrderSuccess onContinue={() => setPlaced(false)} />
        ) : items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2 className="font-serif font-black text-xl text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Browse the feed and add dishes you love.</p>
            <Link href="/feed"
              className="px-5 py-2.5 bg-green-600 text-white font-bold text-sm rounded-xl
                         hover:bg-green-700 transition-colors shadow-[0_4px_12px_rgba(77,158,138,0.3)]">
              Browse Feed
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Items grouped by chef */}
            {groups.map((group) => {
              const subtotal = group.items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0);
              return (
                <div key={group.cookUsername} className="bg-white rounded-2xl border border-gray-100
                                                          shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500
                                      flex items-center justify-center text-white font-bold text-sm">
                        {group.cookDisplayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-gray-900">{group.cookDisplayName}</div>
                        <div className="text-[10px] text-gray-400">@{group.cookUsername}</div>
                      </div>
                    </div>
                    <div className="text-[13px] font-black text-green-700">${subtotal.toFixed(2)}</div>
                  </div>

                  <div className="px-4 divide-y divide-gray-50">
                    {group.items.map((item: CartItem) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        onRemove={removeFromCart}
                        onQty={updateQuantity}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Customer info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5
                            shadow-[0_2px_12px_rgba(0,0,0,0.06)] space-y-3">
              <h3 className="font-bold text-[14px] text-gray-900">Your Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none
                               focus:border-green-400 focus:ring-2 focus:ring-green-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none
                               focus:border-green-400 focus:ring-2 focus:ring-green-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                  Order notes (optional)
                </label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dietary restrictions, delivery instructions…"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none resize-none
                             focus:border-green-400 focus:ring-2 focus:ring-green-100" />
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5
                            shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <h3 className="font-bold text-[14px] text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-[13.5px]">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>HST (13%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between text-gray-900 font-black text-[15px]">
                  <span>Total</span>
                  <span className="text-green-700">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !name.trim() || !email.trim()}
                className="mt-5 w-full py-3.5 bg-green-600 text-white font-bold text-sm rounded-xl
                           hover:bg-green-700 transition-colors shadow-[0_4px_16px_rgba(77,158,138,0.35)]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Place Order · ${grandTotal.toFixed(2)}
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-2.5">
                Payment collected at pickup/delivery by the chef
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
