"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Flame, GlassWater, Star } from "lucide-react";
import type { Product } from "@/types";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { formatCurrency } from "@/lib/utils";

function strengthWidth(strength: Product["strength"]) {
  switch (strength) {
    case "Mild":
      return "25%";
    case "Medium":
      return "50%";
    case "Medium-Full":
      return "75%";
    case "Full":
      return "100%";
    default:
      return "50%";
  }
}

export function QuickViewSheet({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] || null);
  const displayPrice = product.salePrice || product.price;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Quick View</Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-2xl overflow-y-auto border-l border-yisos-gold/20 bg-yisos-charcoal/95 p-0">
        <div className="space-y-6 p-6">
          <div className="space-y-2 pr-8">
            <SheetTitle className="font-display text-4xl text-yisos-bone">{product.name}</SheetTitle>
            <SheetDescription className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </SheetDescription>
          </div>

          <div className="relative h-[24rem] overflow-hidden rounded-2xl border border-border">
            {selectedImage ? (
              <Image src={selectedImage} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,148,52,0.12),transparent_22%),linear-gradient(180deg,rgba(17,15,14,0.98),rgba(8,8,8,1))]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          </div>

          {product.images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-20 overflow-hidden rounded-xl border ${
                    selectedImage === image ? "border-yisos-gold" : "border-border"
                  }`}
                >
                  <Image src={image} alt={product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Badge variant="gold">{product.strength}</Badge>
            <Badge variant="outline">{product.size}</Badge>
            <Badge variant="outline">Origin: {product.origin}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-black/20 p-4">
              <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-yisos-gold">
                <Flame className="h-3.5 w-3.5" />
                Strength
              </div>
              <div className="text-sm text-yisos-stitch">{product.strength}</div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-yisos-gold via-[#d8ac53] to-[#c9551e]"
                  style={{ width: strengthWidth(product.strength) }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-black/20 p-4">
              <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-yisos-gold">
                <GlassWater className="h-3.5 w-3.5" />
                Pairing
              </div>
              <div className="text-sm text-yisos-stitch">{product.pairingSuggestions.slice(0, 2).join(" / ") || "To be configured"}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tastingNotes.slice(0, 4).map((note) => (
              <span
                key={note}
                className="rounded-full border border-border/60 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-yisos-bone/72"
              >
                {note}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              {product.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-yisos-stitch">{formatCurrency(displayPrice)}</span>
                  <span className="text-sm text-yisos-bone/60 line-through">{formatCurrency(product.price)}</span>
                </div>
              ) : (
                <span className="text-2xl font-semibold text-yisos-stitch">{formatCurrency(displayPrice)}</span>
              )}
              <div className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-yisos-gold text-yisos-gold" />
                {product.rating.toFixed(1)} rating
              </div>
            </div>
            <WishlistButton productId={product.id} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AddToCartButton product={product} className="w-full" />
            <Button asChild variant="outline" className="w-full">
              <Link href={`/shop/${product.slug}`}>View Full Product</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
