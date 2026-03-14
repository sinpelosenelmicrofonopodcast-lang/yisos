import { buildMetadata } from "@/lib/seo/metadata";
import { getCategories, getProducts } from "@/lib/services/product-service";
import { ShopClient } from "@/components/shop/shop-client";

export const metadata = buildMetadata({
  title: "Shop Premium Cigars",
  description: "Browse YISOS CIGARS collections with filters for strength, flavor, wrapper, and price.",
  path: "/shop"
});

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_right,rgba(90,98,15,0.15),transparent_30%),linear-gradient(180deg,rgba(26,21,19,0.95),rgba(11,10,11,0.96))] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-xs uppercase tracking-[0.28em] text-yisos-gold">Private Collection</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl leading-[0.94] text-yisos-stitch md:text-6xl">
            The Collection For Tonight&apos;s Ritual
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-yisos-bone/78 md:text-base">
            Explore premium cigars by strength, mood, wrapper, and pairing. This page should feel like walking into a private cellar, not a standard catalog.
          </p>
        </div>
      </section>
      <ShopClient products={products} categories={categories} />
    </>
  );
}
