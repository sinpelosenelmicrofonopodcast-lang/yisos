import { SectionHeading } from "@/components/sections/section-heading";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types";

export function BestSellersCarousel({ products }: { products: Product[] }) {
  const bestSellers = products
    .filter((product) => product.bestSeller && product.images.length > 0)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 8);

  if (!bestSellers.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <SectionHeading
        eyebrow="Best Sellers"
        title="Tonight's Most Requested Cigars"
        description="Real products, real inventory, and the blends customers are reaching for right now."
      />

      <div className="mt-10 overflow-x-auto pb-4">
        <div className="flex min-w-max gap-5">
          {bestSellers.map((product) => (
            <div key={product.id} className="w-[20rem] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
