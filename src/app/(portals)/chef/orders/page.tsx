"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Toast } from "@/components/ui/Toast";
import type { Order, OrderStatus } from "@/types";

const ORDERS_STORAGE_KEY = "dished_orders";

function getOrders(cookId: number): Order[] {
  try {
    const all: Order[] = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
    return all.filter((o) => o.cookId === cookId);
  } catch { return []; }
}

function saveOrders(cookId: number, orders: Order[]) {
  try {
    const all: Order[] = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
    const others = all.filter((o) => o.cookId !== cookId);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([...others, ...orders]));
  } catch { /* silent */ }
}

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  pending: "confirmed", confirmed: "preparing", preparing: "ready",
  ready: "delivered", delivered: null, cancelled: null,
};

const STATUS_STEPS: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "delivered"];

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  pending:   { label: "Pending",   color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200",  dot: "bg-amber-400"  },
  confirmed: { label: "Confirmed", color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   dot: "bg-blue-500"   },
  preparing: { label: "Preparing", color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-200", dot: "bg-purple-500" },
  ready:     { label: "Ready",     color: "text-teal-700",   bg: "bg-teal-50",    border: "border-teal-200",   dot: "bg-teal-500"   },
  delivered: { label: "Delivered", color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200",  dot: "bg-green-500"  },
  cancelled: { label: "Cancelled", color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200",    dot: "bg-red-400"    },
};

type FilterTab = "all" | OrderStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Delivered", value: "delivered" },
];

export default function ChefOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (user) setOrders(getOrders(user.id));
  }, [user]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    if (user) saveOrders(user.id, updated);
    setToast(`Order marked as ${newStatus}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-black text-2xl text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage orders placed for your menu.</p>
        </div>
        {/* Summary pill */}
        {orders.filter((o) => o.status === "pending").length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-700">
              {orders.filter((o) => o.status === "pending").length} pending
            </span>
          </div>
        )}
      </div>

      {/* ── Filter tabs ─────────────────────────────────── */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === "all" ? orders.length : orders.filter((o) => o.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border whitespace-nowrap
                          transition-all duration-200 cursor-pointer
                ${filter === tab.value
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                ${filter === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Orders list ─────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-300">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-400">
            {filter === "all" ? "No orders yet" : `No ${filter} orders`}
          </p>
          <p className="text-xs text-gray-400 mt-1">Orders from customers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const meta      = STATUS_META[order.status];
            const nextStatus = STATUS_FLOW[order.status];
            const stepIdx   = STATUS_STEPS.indexOf(order.status as OrderStatus);
            const isCancelled = order.status === "cancelled";

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                {/* Card header */}
                <div className={`px-5 py-3.5 flex items-center justify-between border-b ${meta.bg} ${meta.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm
                                     ${meta.bg} ${meta.color} border ${meta.border}`}>
                      {order.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${meta.color}`}>{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</span>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${meta.bg} ${meta.color} ${meta.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </div>
                </div>

                {/* Progress stepper (only for active orders) */}
                {!isCancelled && (
                  <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-0">
                      {STATUS_STEPS.map((step, i) => {
                        const done    = i <= stepIdx;
                        const current = i === stepIdx;
                        return (
                          <div key={step} className="flex items-center flex-1 last:flex-none">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black
                                            flex-shrink-0 transition-all
                                            ${current  ? "bg-green-600 text-white shadow-[0_0_0_3px_rgba(77,158,138,0.2)]" :
                                              done    ? "bg-green-500 text-white" :
                                                        "bg-gray-200 text-gray-400"}`}>
                              {done && !current ? (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              ) : (i + 1)}
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 rounded transition-all ${i < stepIdx ? "bg-green-400" : "bg-gray-200"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1.5">
                      {STATUS_STEPS.map((step) => (
                        <div key={step} className="flex-1 last:flex-none text-center">
                          <span className="text-[9px] text-gray-400 capitalize font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="px-5 py-4">
                  <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-gray-700 font-medium">{item.quantity}× {item.name}</span>
                        <span className="text-gray-900 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 mt-2 pt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-800">Total</span>
                      <span className="text-base font-black text-gray-900">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="text-xs text-amber-700 mb-3 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100 flex gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span><strong>Note:</strong> {order.notes}</span>
                    </div>
                  )}

                  {/* Actions */}
                  {order.status !== "delivered" && order.status !== "cancelled" && (
                    <div className="flex gap-2 pt-1">
                      {nextStatus && (
                        <button
                          onClick={() => updateStatus(order.id, nextStatus)}
                          className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 border border-red-200
                                   hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
