import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flame, GlassWater, Star } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

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

export function ProductReveal({ products }: { products: Product[] }) {
  const revealProducts = products
    .filter((product) => product.images.length > 0)
    .sort((a, b) => {
      const score = (product: Product) =>
        Number(product.featured) * 4 +
        Number(product.newArrival) * 3 +
        Number(product.bestSeller) * 2 +
        Number(product.limitedEdition);

      return score(b) - score(a);
    })
    .slice(0, 4);

  if (!revealProducts.length) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
        <SectionHeading
          eyebrow="Collection"
          title="Cinematic Product Reveals"
          description="Publish featured products in Supabase to activate this section."
        />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <SectionHeading
        eyebrow="Collection"
        title="A Luxury Product Reveal, Not A Basic Grid"
        description="Macro texture, ember glow, tasting notes, and lounge pairings. Every blend should feel discovered, not listed."
      />
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        {revealProducts.map((product, index) => {
          const effectivePrice = product.salePrice || product.price;

          return (
            <article
              key={product.id}
              className="group relative overflow-hidden rounded-[28px] border border-yisos-gold/15 bg-[#0d0908] p-4 shadow-panel"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(90,98,15,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
              <div className="relative grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="relative min-h-[370px] overflow-hidden rounded-[22px] border border-white/5">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-yisos-gold/30 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-yisos-stitch">
                    <span className="ember-dot h-2 w-2 rounded-full bg-[#c9551e]" />
                    Ember Finish
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.28em] text-yisos-gold">Reveal {String(index + 1).padStart(2, "0")}</div>
                      <div className="mt-1 font-display text-3xl text-yisos-stitch">{product.name}</div>
                    </div>
                    <Link
                      href={`/shop/${product.slug}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-yisos-gold/30 bg-black/35 text-yisos-stitch transition hover:border-yisos-gold hover:text-yisos-gold"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-[22px] border border-white/5 bg-white/[0.02] p-6">
                  <div>
                    <div className="flex items-center gap-3 text-sm text-yisos-bone/75">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yisos-gold text-yisos-gold" />
                        {product.rating.toFixed(1)}
                      </span>
                      <span>{product.origin}</span>
                      <span>{product.size}</span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-yisos-bone/82">{product.description}</p>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-border/70 bg-black/20 p-4">
                        <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-yisos-gold">
                          <Flame className="h-3.5 w-3.5" />
                          Strength
                        </div>
                        <div className="text-sm text-yisos-stitch">{product.strength}</div>
                        <div className="mt-3 h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-yisos-gold via-[#d5a64a] to-[#c9551e]"
                            style={{ width: strengthWidth(product.strength) }}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-black/20 p-4">
                        <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-yisos-gold">
                          <GlassWater className="h-3.5 w-3.5" />
                          Pairing
                        </div>
                        <div className="text-sm text-yisos-stitch">
                          {product.pairingSuggestions.slice(0, 2).join(" / ")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-xs uppercase tracking-[0.24em] text-yisos-gold">Tasting Notes</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.tastingNotes.slice(0, 4).map((note) => (
                          <span
                            key={note}
                            className="rounded-full border border-border/70 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.16em] text-yisos-bone/78"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-yisos-gold">From</div>
                      <div className="mt-1 font-display text-4xl text-yisos-stitch">{formatCurrency(effectivePrice)}</div>
                    </div>
                    <div className="flex gap-3">
                      <Button asChild variant="outline">
                        <Link href={`/shop/${product.slug}`}>View Ritual</Link>
                      </Button>
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
