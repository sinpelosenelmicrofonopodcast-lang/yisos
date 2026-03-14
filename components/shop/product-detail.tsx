"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import type { Product, Review } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistButton } from "@/components/shop/wishlist-button";

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
}

export function ProductDetail({ product, reviews }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const stockMessage = useMemo(() => {
    if (product.stock <= 0) return "Out of stock";
    if (product.stock < 15) return `Only ${product.stock} left in stock`;
    return "Ready to ship in 24 hours";
  }, [product.stock]);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 pt-6 lg:grid-cols-[1.15fr,0.85fr] lg:gap-10 lg:px-8 lg:pb-20 lg:pt-10">
      <div>
        <div className="relative h-[360px] overflow-hidden rounded-2xl border border-border md:h-[470px]">
          <Image src={selectedImage} alt={product.name} fill className="object-cover" />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 md:mt-4 md:gap-3">
          {product.images.map((image) => (
            <button
              key={image}
              onClick={() => setSelectedImage(image)}
              className="relative h-20 overflow-hidden rounded-lg border border-border md:h-24"
            >
              <Image src={image} alt={product.name} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <p className="text-xs uppercase tracking-[0.28em] text-yisos-gold">Premium Blend</p>
        <h1 className="mt-3 font-display text-4xl leading-[0.95] text-yisos-bone md:text-5xl">{product.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="gold">{product.strength}</Badge>
          <Badge variant="outline">{product.size}</Badge>
          <Badge variant="outline">Origin: {product.origin}</Badge>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-yisos-charcoal/70 p-4 md:mt-6 md:p-5">
          <div className="flex items-end justify-between">
            <div>
              {product.salePrice ? (
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-semibold text-yisos-bone">{formatCurrency(product.salePrice)}</p>
                  <p className="text-muted-foreground line-through">{formatCurrency(product.price)}</p>
                </div>
              ) : (
                <p className="text-3xl font-semibold text-yisos-bone">{formatCurrency(product.price)}</p>
              )}
            </div>
            <WishlistButton productId={product.id} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{stockMessage}</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <AddToCartButton product={product} className="w-full" />
            <Button className="w-full" variant="secondary">
              Buy Now
            </Button>
          </div>

          <div className="mt-5 space-y-2 text-xs text-muted-foreground">
            <p className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-yisos-gold" /> Free shipping over $180
            </p>
            <p className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-yisos-gold" /> Secure checkout with Stripe + Wallets
            </p>
            <p className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-yisos-gold" /> 21+ age verified order flow
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="mt-5 rounded-xl border border-border bg-yisos-charcoal/60 px-4 md:mt-6">
          <AccordionItem value="notes">
            <AccordionTrigger>Tasting Notes</AccordionTrigger>
            <AccordionContent>{product.tastingNotes.join(", ")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="blend">
            <AccordionTrigger>Wrapper / Binder / Filler</AccordionTrigger>
            <AccordionContent>
              Wrapper: {product.wrapper}
              <br />
              Binder: {product.binder}
              <br />
              Filler: {product.filler}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="pairing">
            <AccordionTrigger>Pairing Suggestions</AccordionTrigger>
            <AccordionContent>{product.pairingSuggestions.join(", ")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping Info</AccordionTrigger>
            <AccordionContent>
              Orders before 4PM CT ship same day. Adult signature required on delivery where applicable.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {reviews.length ? (
          <div className="mt-5 rounded-xl border border-border bg-yisos-charcoal/60 p-4 md:mt-6">
            <p className="font-display text-2xl text-yisos-bone">Reviews</p>
            <div className="mt-3 space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="rounded-lg border border-border bg-yisos-black/40 p-3">
                  <p className="text-sm text-muted-foreground">“{review.comment}”</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-yisos-gold">{review.userName}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
