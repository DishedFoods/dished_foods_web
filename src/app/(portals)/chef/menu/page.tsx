"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Toast } from "@/components/ui/Toast";
import type { MenuItem } from "@/types";

const MENU_STORAGE_KEY = "dished_menu_items";
const MENU_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface CachedMenuStore {
  items: MenuItem[];
  savedAt: number; // Unix ms timestamp
}

function getMenuItems(cookId: number): MenuItem[] {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (!raw) return [];
    const store = JSON.parse(raw) as Record<string, CachedMenuStore>;
    const entry = store[String(cookId)];
    if (!entry) return [];
    // Expire stale cache
    if (Date.now() - entry.savedAt > MENU_CACHE_TTL_MS) {
      const updated = { ...store };
      delete updated[String(cookId)];
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updated));
      return [];
    }
    return Array.isArray(entry.items) ? entry.items : [];
  } catch { return []; }
}

function saveMenuItems(cookId: number, items: MenuItem[]) {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    const store: Record<string, CachedMenuStore> = raw ? JSON.parse(raw) : {};
    store[String(cookId)] = { items, savedAt: Date.now() };
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(store));
  } catch { /* silent — non-critical cache */ }
}

const CATEGORIES = [
  "Appetizer", "Main Course", "Side Dish", "Dessert",
  "Snack", "Beverage", "Soup", "Salad", "Bread", "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Appetizer":   "bg-orange-50 text-orange-700 border-orange-200",
  "Main Course": "bg-green-50 text-green-700 border-green-200",
  "Side Dish":   "bg-teal-50 text-teal-700 border-teal-200",
  "Dessert":     "bg-pink-50 text-pink-700 border-pink-200",
  "Snack":       "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Beverage":    "bg-blue-50 text-blue-700 border-blue-200",
  "Soup":        "bg-amber-50 text-amber-700 border-amber-200",
  "Salad":       "bg-lime-50 text-lime-700 border-lime-200",
  "Bread":       "bg-stone-50 text-stone-700 border-stone-200",
  "Other":       "bg-gray-50 text-gray-600 border-gray-200",
};

const emptyForm = {
  name: "", description: "", price: "", quantity: "",
  ingredients: "", notes: "", expiryDate: "", category: "Main Course",
};

/* ── Field wrapper ─────────────────────────────────────── */
function Field({ label, required, error, className, children }: {
  label: string; required?: boolean; error?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-white outline-none transition-all
   ${err ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
         : "border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100"}`;

export default function ChefMenuPage() {
  const { user } = useAuth();
  const [items, setItems]     = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]   = useState<string | null>(null);
  const [form, setForm]       = useState(emptyForm);
  const [toast, setToast]     = useState<string | null>(null);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { if (user) setItems(getMenuItems(user.id)); }, [user]);

  const upd = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())                              errs.name = "Item name is required";
    if (!form.price || parseFloat(form.price) <= 0)    errs.price = "Valid price required";
    if (!form.quantity || parseInt(form.quantity) <= 0) errs.quantity = "Valid quantity required";
    if (!form.expiryDate)                               errs.expiryDate = "Expiry date required";
    else if (new Date(form.expiryDate) <= new Date())   errs.expiryDate = "Must be in the future";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) return;
    if (editId) {
      const updated = items.map((item) =>
        item.id === editId ? {
          ...item, name: form.name.trim(), description: form.description.trim(),
          price: parseFloat(form.price), quantity: parseInt(form.quantity),
          ingredients: form.ingredients.trim(), notes: form.notes.trim(),
          expiryDate: form.expiryDate, category: form.category,
        } : item
      );
      setItems(updated); saveMenuItems(user.id, updated); setToast("Menu item updated!");
    } else {
      const newItem: MenuItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        cookId: user.id, name: form.name.trim(), description: form.description.trim(),
        price: parseFloat(form.price), quantity: parseInt(form.quantity),
        ingredients: form.ingredients.trim(), notes: form.notes.trim(),
        expiryDate: form.expiryDate, category: form.category,
        available: true, createdAt: new Date().toISOString(),
      };
      const updated = [...items, newItem];
      setItems(updated); saveMenuItems(user.id, updated); setToast("Menu item added!");
    }
    setForm(emptyForm); setEditId(null); setShowForm(false);
  };

  const startEdit = (item: MenuItem) => {
    setForm({
      name: item.name, description: item.description, price: item.price.toString(),
      quantity: item.quantity.toString(), ingredients: item.ingredients,
      notes: item.notes, expiryDate: item.expiryDate, category: item.category,
    });
    setEditId(item.id); setShowForm(true); setErrors({});
    setTimeout(() => document.getElementById("menu-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const toggleAvailability = (itemId: string) => {
    if (!user) return;
    const updated = items.map((item) => item.id === itemId ? { ...item, available: !item.available } : item);
    setItems(updated); saveMenuItems(user.id, updated);
  };

  const deleteItem = (itemId: string) => {
    if (!user) return;
    const updated = items.filter((item) => item.id !== itemId);
    setItems(updated); saveMenuItems(user.id, updated);
    setToast("Item removed"); setConfirmDelete(null);
  };

  const cancelForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); setErrors({}); };

  const availableCount  = items.filter((i) => i.available).length;
  const expiredCount    = items.filter((i) => new Date(i.expiryDate) <= new Date()).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif font-black text-2xl text-gray-900">Menu</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and publish your dishes for sale.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Summary badges */}
          {items.length > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-200">
                {availableCount} available
              </span>
              {expiredCount > 0 && (
                <span className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200">
                  {expiredCount} expired
                </span>
              )}
            </div>
          )}
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setErrors({}); }}
              className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Item
            </button>
          )}
        </div>
      </div>

      {/* ── Add / Edit Form ─────────────────────────────── */}
      {showForm && (
        <div id="menu-form" className="bg-white rounded-2xl border border-green-200 shadow-sm mb-6 overflow-hidden animate-slide-down">
          {/* Form header */}
          <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-transparent border-b border-green-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {editId
                    ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>
                    : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>
                  }
                </svg>
              </div>
              <h2 className="text-sm font-bold text-gray-900">{editId ? "Edit Menu Item" : "New Menu Item"}</h2>
            </div>
            <button onClick={cancelForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
            {/* Row 1: name + category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Item Name" required error={errors.name} className="sm:col-span-2">
                <input type="text" value={form.name} onChange={(e) => upd("name", e.target.value)}
                  className={inputCls(errors.name)} placeholder="e.g. Butter Chicken" />
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={(e) => upd("category", e.target.value)}
                  className={inputCls() + " cursor-pointer"}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            {/* Row 2: description */}
            <Field label="Description">
              <textarea value={form.description} onChange={(e) => upd("description", e.target.value)} rows={2}
                className={inputCls() + " resize-none"} placeholder="Creamy tomato-based curry with tender chicken..." />
            </Field>

            {/* Row 3: price / qty / expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Price (CAD $)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => upd("price", e.target.value)}
                    className={inputCls(errors.price) + " pl-8"} placeholder="15.99" />
                </div>
              </Field>
              <Field label="Qty Available" required error={errors.quantity}>
                <input type="number" min="1" value={form.quantity} onChange={(e) => upd("quantity", e.target.value)}
                  className={inputCls(errors.quantity)} placeholder="10" />
              </Field>
              <Field label="Expiry Date" required error={errors.expiryDate}>
                <input type="date" value={form.expiryDate} onChange={(e) => upd("expiryDate", e.target.value)}
                  className={inputCls(errors.expiryDate)} />
              </Field>
            </div>

            {/* Row 4: ingredients */}
            <Field label="Ingredients">
              <textarea value={form.ingredients} onChange={(e) => upd("ingredients", e.target.value)} rows={2}
                className={inputCls() + " resize-none"} placeholder="Chicken, tomatoes, cream, butter, garam masala..." />
            </Field>

            {/* Row 5: notes */}
            <Field label="Chef's Notes">
              <textarea value={form.notes} onChange={(e) => upd("notes", e.target.value)} rows={2}
                className={inputCls() + " resize-none"} placeholder="Contains dairy. Mild spice. Served with basmati rice." />
            </Field>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button type="submit" className="btn-primary px-6 py-2.5 text-sm cursor-pointer">
                {editId ? "Update Item" : "Add to Menu"}
              </button>
              <button type="button" onClick={cancelForm}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Menu items grid ─────────────────────────────── */}
      {items.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-300">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-400">No menu items yet</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">Start by adding your first dish.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary px-5 py-2.5 text-sm cursor-pointer">
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const expired  = new Date(item.expiryDate) <= new Date();
            const catColor = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS["Other"];

            return (
              <div key={item.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md
                  ${expired            ? "border-red-200 opacity-80"
                  : !item.available    ? "border-gray-200 opacity-60"
                  :                     "border-green-200"
                  }`}>

                {/* Card header */}
                <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}>
                          {item.category}
                        </span>
                        {expired && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                            EXPIRED
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-black text-gray-900">${item.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-400 mt-0.5">per serving</div>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="px-4 py-3">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10H3"/><path d="M21 6H3"/><path d="M21 14H3"/><path d="M21 18H3"/></svg>
                      Qty: <strong className="text-gray-700">{item.quantity}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Exp: <strong className={expired ? "text-red-600" : "text-gray-700"}>
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </strong>
                    </span>
                  </div>

                  {item.ingredients && (
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-2 border border-gray-100">
                      <span className="font-bold text-gray-600">Ingredients:</span> {item.ingredients}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-2 border border-amber-100">
                      <span className="font-bold">Notes:</span> {item.notes}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => toggleAvailability(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer
                        ${item.available
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"}`}>
                      {item.available ? (
                        <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="inline mr-1 -mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>Available</>
                      ) : "Set Available"}
                    </button>
                    <button onClick={() => startEdit(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer">
                      Edit
                    </button>
                    {confirmDelete === item.id ? (
                      <div className="ml-auto flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 font-medium">Delete?</span>
                        <button onClick={() => deleteItem(item.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer">
                          Yes
                        </button>
                        <button onClick={() => setConfirmDelete(null)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                          No
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(item.id)}
                        className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 border border-red-100 hover:bg-red-50 transition-colors cursor-pointer">
                        Delete
                      </button>
                    )}
                  </div>
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
