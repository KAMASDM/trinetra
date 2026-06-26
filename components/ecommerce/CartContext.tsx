"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  itemKey: (item: CartItem) => string;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function getItemKey(item: CartItem) {
  return `${item.product.id}:${item.size}:${item.color}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem("trinetra-cart");
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("trinetra-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue["addItem"] = (product, options) => {
      const nextItem: CartItem = {
        product,
        quantity: options?.quantity ?? 1,
        size: options?.size ?? product.sizes[0],
        color: options?.color ?? product.colors[0],
      };
      const key = getItemKey(nextItem);

      setItems((current) => {
        const existing = current.find((item) => getItemKey(item) === key);
        if (!existing) return [...current, nextItem];
        return current.map((item) =>
          getItemKey(item) === key
            ? { ...item, quantity: item.quantity + nextItem.quantity }
            : item,
        );
      });
    };

    const updateQuantity: CartContextValue["updateQuantity"] = (key, quantity) => {
      setItems((current) =>
        current
          .map((item) => (getItemKey(item) === key ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      );
    };

    const removeItem: CartContextValue["removeItem"] = (key) => {
      setItems((current) => current.filter((item) => getItemKey(item) !== key));
    };

    return {
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart: () => setItems([]),
      itemKey: getItemKey,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
    };
  }, [items, isDrawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
