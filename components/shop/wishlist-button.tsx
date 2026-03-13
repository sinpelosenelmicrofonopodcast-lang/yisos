"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "yisos-favorites";

export function WishlistButton({ productId }: { productId: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    setActive(ids.includes(productId));
  }, [productId]);

  const toggle = async () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    const next = active ? ids.filter((id) => id !== productId) : [...new Set([...ids, productId])];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setActive(!active);

    await fetch("/api/favorites/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, active: !active })
    }).catch(() => null);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label="Save to favorites"
      className={cn(active && "border-yisos-gold/70 text-yisos-gold")}
    >
      <Heart className={cn("h-4 w-4", active && "fill-yisos-gold")} />
    </Button>
  );
}
