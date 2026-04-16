"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { MenuItem, Order, ChefDashboardStats } from "@/types";

const MENU_STORAGE_KEY   = "dished_menu_items";
const ORDERS_STORAGE_KEY = "dished_orders";

function getStored<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  preparing: "bg-purple-50 text-purple-700 border-purple-200",
  ready:     "bg-teal-50 text-teal-700 border-teal-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

function StatCard({ label, value, sub, icon, gradient, iconBg }: StatCardProps) {
  return (
    <div className={`relative rounded-2xl p-5 overflow-hidden shadow-sm border ${gradient}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black tracking-tight leading-none mb-1">{value}</div>
      <div className="text-xs font-bold opacity-70 uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs opacity-60 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function ChefDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChefDashboardStats>({
    totalOrders: 0, pendingOrders: 0, totalMenuItems: 0, totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const menuItems = getStored<MenuItem>(MENU_STORAGE_KEY).filter((i) => i.cookId === user?.id);
    const orders    = getStored<Order>(ORDERS_STORAGE_KEY).filter((o) => o.cookId === user?.id);
    setStats({
      totalOrders:    orders.length,
      pendingOrders:  orders.filter((o) => o.status === "pending" || o.status === "confirmed").length,
      totalMenuItems: menuItems.length,
      totalRevenue:   orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
    });
    setRecentOrders(orders.slice(-5).reverse());
  }, [user?.id]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const today = new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="max-w-5xl mx-auto space-y-7">

      {/* ── Hero Greeting ──────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--green-primary)] via-[var(--green-dark)] to-[var(--green-deeper)] p-6 md:p-8 text-white shadow-[0_8px_32px_rgba(77,158,138,0.35)]">
        {/* background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-16 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />

        <div className="relative">
          <p className="text-white/70 text-sm font-medium mb-1">{today}</p>
          <h1 className="font-serif font-black text-2xl md:text-3xl leading-tight mb-2">
            {greeting()}, {user?.username} 👋
          </h1>
          <p className="text-white/75 text-sm max-w-md">
            Here&apos;s a snapshot of your kitchen. Add dishes to your menu to start receiving orders.
          </p>
          <Link
            href="/chef/menu"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-white text-[var(--green-dark)]
                       text-sm font-bold shadow-sm hover:shadow-md hover:bg-green-50 transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Menu Item
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>}
          gradient="bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200 text-blue-900"
          iconBg="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Pending"
          value={stats.pendingOrders}
          sub="need action"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          gradient="bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200 text-amber-900"
          iconBg="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="Menu Items"
          value={stats.totalMenuItems}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>}
          gradient="bg-gradient-to-br from-green-50 to-green-100/60 border-green-200 text-green-900"
          iconBg="bg-green-100 text-green-600"
        />
        <StatCard
          label="Revenue"
          value={`$${stats.totalRevenue.toFixed(0)}`}
          sub={`$${stats.totalRevenue.toFixed(2)} total`}
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          gradient="bg-gradient-to-br from-purple-50 to-purple-100/60 border-purple-200 text-purple-900"
          iconBg="bg-purple-100 text-purple-600"
        />
      </div>

      {/* ── Quick Actions ───────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/chef/menu"
            className="group flex items-center gap-4 bg-white rounded-2xl border border-green-200 p-4
                       hover:border-green-400 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600
                            group-hover:bg-green-100 group-hover:scale-105 transition-all flex-shrink-0 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">Add Menu Item</div>
              <div className="text-xs text-gray-500 mt-0.5">Post a new dish for customers</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>

          <Link href="/chef/orders"
            className="group flex items-center gap-4 bg-white rounded-2xl border border-blue-100 p-4
                       hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600
                            group-hover:bg-blue-100 group-hover:scale-105 transition-all flex-shrink-0 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">View Orders</div>
              <div className="text-xs text-gray-500 mt-0.5">Manage and track incoming orders</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>

          <Link href="/chef/profile"
            className="group flex items-center gap-4 bg-white rounded-2xl border border-purple-100 p-4
                       hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600
                            group-hover:bg-purple-100 group-hover:scale-105 transition-all flex-shrink-0 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">Edit Profile</div>
              <div className="text-xs text-gray-500 mt-0.5">Update address, cuisines, bio</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>

          <div className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 opacity-60 cursor-not-allowed select-none">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-500">Messages</div>
              <div className="text-xs text-gray-400 mt-0.5">Coming soon</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-400">Soon</span>
          </div>
        </div>
      </div>

      {/* ── Recent Orders ───────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-green-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-green-600">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Recent Orders
          </h2>
          <Link href="/chef/orders" className="text-xs font-bold text-green-600 hover:text-green-700 hover:underline transition-colors cursor-pointer">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>
              </svg>
            </div>
            <p className="text-sm font-bold text-gray-400">No orders yet</p>
            <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers start ordering.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
                    {order.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{order.customerName}</div>
                    <div className="text-xs text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
