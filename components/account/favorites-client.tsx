"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types";

const STORAGE_KEY = "yisos-favorites";

export function FavoritesClient({ products }: { products: Product[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setFavoriteIds(raw ? (JSON.parse(raw) as string[]) : []);
  }, []);

  const favorites = products.filter((product) => favoriteIds.includes(product.id));

  if (!favorites.length) {
    return (
      <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-8 text-muted-foreground">
        No saved favorites yet. Tap the heart icon on products to build your shortlist.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {favorites.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
