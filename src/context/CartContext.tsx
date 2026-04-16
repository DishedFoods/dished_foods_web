"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CartItem } from "@/types";

const CART_KEY = "dished_cart";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  count: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // If same post already in cart, increment quantity
      const existing = prev.find((c) => c.postId === item.postId);
      let next: CartItem[];
      if (existing) {
        next = prev.map((c) =>
          c.postId === item.postId ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        const newItem: CartItem = { ...item, id: crypto.randomUUID() };
        next = [...prev, newItem];
      }
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, quantity: qty } : c));
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const count = items.reduce((s, c) => s + c.quantity, 0);
  const total = items.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
