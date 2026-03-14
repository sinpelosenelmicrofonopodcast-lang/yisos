import Link from "next/link";
import Image from "next/image";
import { Flame, GlassWater, Star } from "lucide-react";
import type { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { QuickViewSheet } from "@/components/shop/quick-view-sheet";

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

export function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.salePrice || product.price;
  const primaryImage = product.images[0];

  return (
    <Card className="surface-1 group overflow-hidden border-border/85 transition duration-500 hover:-translate-y-1 hover:border-yisos-gold/45">
      <Link href={`/shop/${product.slug}`} className="relative block h-64 overflow-hidden md:h-72">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,148,52,0.12),transparent_22%),linear-gradient(180deg,rgba(17,15,14,0.98),rgba(8,8,8,1))]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.badges?.map((badge) => (
            <Badge key={badge} variant="gold">
              {badge}
            </Badge>
          ))}
          {product.stock < 20 ? <Badge variant="olive">Low Stock</Badge> : null}
        </div>
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-yisos-gold/20 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-yisos-stitch">
          <span className="ember-dot h-2 w-2 rounded-full bg-[#c9551e]" />
          {primaryImage ? "Ember finish" : "Image pending"}
        </div>
      </Link>
      <CardContent className="space-y-4 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/shop/${product.slug}`} className="font-display text-xl text-yisos-stitch hover:text-yisos-gold">
              {product.name}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{product.size}</p>
          </div>
          <WishlistButton productId={product.id} />
        </div>

        <p className="line-clamp-2 text-sm text-yisos-bone/75">{product.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{product.strength}</span>
          <span className="text-yisos-gold">•</span>
          <span>{product.wrapper}</span>
          <span className="text-yisos-gold">•</span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-yisos-gold text-yisos-gold" /> {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="rounded-2xl border border-border/70 bg-black/20 p-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-yisos-gold">
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              Strength
            </span>
            <span>{product.strength}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-yisos-gold via-[#d8ac53] to-[#c9551e]"
              style={{ width: strengthWidth(product.strength) }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tastingNotes.slice(0, 3).map((note) => (
              <span
                key={note}
                className="rounded-full border border-border/60 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-yisos-bone/72"
              >
                {note}
              </span>
            ))}
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-yisos-bone/66">
            <GlassWater className="h-3.5 w-3.5 text-yisos-gold" />
            {product.pairingSuggestions.slice(0, 2).join(" / ")}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-yisos-stitch">{formatCurrency(displayPrice)}</span>
                <span className="text-sm text-yisos-bone/60 line-through">{formatCurrency(product.price)}</span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-yisos-stitch">{formatCurrency(displayPrice)}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <QuickViewSheet product={product} />
            <AddToCartButton product={product} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
