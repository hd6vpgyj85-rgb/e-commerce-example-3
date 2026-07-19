"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "netly_cart";

function sameLine(a: CartItem, b: Pick<CartItem, "productId" | "variant">) {
  return (
    a.productId === b.productId &&
    JSON.stringify(a.variant) === JSON.stringify(b.variant)
  );
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant: Record<string, string>) => void;
  updateQty: (
    productId: string,
    variant: Record<string, string>,
    qty: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-time sync from localStorage on mount — an external system, not
      // derived React state, so this is the documented exception to the rule.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted cart data
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, item));
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item) ? { ...p, qty: p.qty + item.qty } : p
        );
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }

  function removeItem(productId: string, variant: Record<string, string>) {
    setItems((prev) => prev.filter((p) => !sameLine(p, { productId, variant })));
  }

  function updateQty(
    productId: string,
    variant: Record<string, string>,
    qty: number
  ) {
    setItems((prev) =>
      prev.map((p) =>
        sameLine(p, { productId, variant }) ? { ...p, qty: Math.max(1, qty) } : p
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
