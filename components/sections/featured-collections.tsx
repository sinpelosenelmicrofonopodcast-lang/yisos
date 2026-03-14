import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Product } from "@/types";

const collectionDefinitions = [
  {
    key: "best-sellers",
    title: "Best Sellers",
    description: "Our most wanted profiles with consistently sold-out rotations.",
    href: "/shop?sort=best-selling"
  },
  {
    key: "new-arrivals",
    title: "New Arrivals",
    description: "Fresh drops from master rollers and limited monthly runs.",
    href: "/shop?new=true"
  },
  {
    key: "lounge-favorites",
    title: "Lounge Favorites",
    description: "Balanced cigars designed for long, unhurried conversations.",
    href: "/shop?category=lounge-favorites"
  },
  {
    key: "limited-editions",
    title: "Limited Editions",
    description: "Collector-grade releases available in strict allocation.",
    href: "/shop?category=limited-editions"
  },
  {
    key: "gift-picks",
    title: "Gift Picks",
    description: "Luxury gift-ready options for clients, partners, and celebrations.",
    href: "/shop?category=gift-picks"
  }
];

function pickCollectionProduct(products: Product[], key: string) {
  const withImages = products.filter((product) => product.images.length > 0);

  const matchers: Record<string, (product: Product) => boolean> = {
    "best-sellers": (product) => Boolean(product.bestSeller),
    "new-arrivals": (product) => Boolean(product.newArrival),
    "lounge-favorites": (product) => product.categorySlugs.includes("lounge-favorites"),
    "limited-editions": (product) => Boolean(product.limitedEdition) || product.categorySlugs.includes("limited-editions"),
    "gift-picks": (product) => product.categorySlugs.includes("gift-picks")
  };

  return (
    withImages.find(matchers[key]) ||
    withImages.find((product) => product.featured) ||
    withImages[0] ||
    null
  );
}

export function FeaturedCollections({ products }: { products: Product[] }) {
  const collections = collectionDefinitions.map((collection) => {
    const heroProduct = pickCollectionProduct(products, collection.key);

    return {
      ...collection,
      image: heroProduct?.images[0] || null,
      productName: heroProduct?.name || null
    };
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="Curated"
        title="Featured Collections"
        description="Each collection is built around mood, strength, and pairing - not shelf clutter."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:mt-10 xl:grid-cols-12">
        {collections.map((collection, index) => (
          <Link
            key={collection.title}
            href={collection.href}
            className={`group relative overflow-hidden rounded-[26px] border border-yisos-gold/15 ${
              collection.title === "Lounge Favorites"
                ? "xl:col-span-5"
                : collection.title === "Best Sellers"
                  ? "md:col-span-2 xl:col-span-4"
                  : "xl:col-span-3"
            }`}
          >
            {collection.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${collection.image}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,148,52,0.12),transparent_22%),linear-gradient(180deg,rgba(17,15,14,0.98),rgba(8,8,8,1))]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/15" />
            <div
              className={`relative flex flex-col justify-end p-5 md:p-6 ${
                index === 0 ? "min-h-[320px] md:min-h-[360px]" : "min-h-[250px] md:min-h-[280px]"
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.24em] text-yisos-gold">Collection</div>
              <p className="mt-2 font-display text-[2rem] leading-[0.92] text-yisos-stitch md:text-3xl">
                {collection.title}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-yisos-bone/78 md:leading-7">
                {collection.description}
              </p>
              {collection.productName ? (
                <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-yisos-bone/58 md:tracking-[0.24em]">
                  Current Highlight: {collection.productName}
                </p>
              ) : null}
              <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-yisos-gold md:text-xs md:tracking-[0.2em]">
                Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
