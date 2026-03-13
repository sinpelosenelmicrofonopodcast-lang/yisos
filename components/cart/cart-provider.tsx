"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Product } from "@/types";
import { calculateCartSummary, getCartCount } from "@/lib/services/cart-utils";

const CART_STORAGE_KEY = "yisos-cart-v1";

interface CartContextValue {
  items: CartItem[];
  count: number;
  discount: number;
  promoCode: string | null;
  summary: ReturnType<typeof calculateCartSummary>;
  cartOpen: boolean;
  setCartOpen: (value: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { items: CartItem[]; discount: number; promoCode: string | null };
      setItems(parsed.items || []);
      setDiscount(parsed.discount || 0);
      setPromoCode(parsed.promoCode || null);
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, discount, promoCode }));
  }, [items, discount, promoCode]);

  useEffect(() => {
    void fetch("/api/cart-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });
  }, [items]);

  const count = getCartCount(items);
  const summary = useMemo(() => calculateCartSummary(items, 18, discount), [items, discount]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.salePrice || product.price,
          image: product.images[0],
          quantity,
          stock: product.stock
        }
      ];
    });
    setCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(Math.max(quantity, 1), item.stock)
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    setPromoCode(null);
  };

  const applyPromoCode = async (code: string) => {
    const normalized = code.trim().toUpperCase();

    const response = await fetch("/api/promo-codes/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: normalized, subtotal: summary.subtotal })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Invalid promo code" }));
      return { success: false, message: errorData.message || "Invalid promo code" };
    }

    const data = (await response.json()) as { discount: number; code: string };
    setDiscount(data.discount);
    setPromoCode(data.code);

    return { success: true, message: `${data.code} applied` };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        discount,
        promoCode,
        summary,
        cartOpen,
        setCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromoCode
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
