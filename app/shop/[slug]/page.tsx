import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product-service";
import { getProductReviews } from "@/lib/services/review-service";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductCard } from "@/components/shop/product-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildMetadata({ title: "Product not found", path: `/shop/${slug}` });
  }

  return buildMetadata({
    title: product.name,
    description: product.description,
    path: `/shop/${product.slug}`,
    image: product.images[0]
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [reviews, relatedProducts] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.slug)
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.salePrice || product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  };

  return (
    <>
      <ProductDetail product={product} reviews={reviews} />

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8 md:pb-20">
        <h2 className="font-display text-3xl text-yisos-bone md:text-4xl">Related Blends</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8 md:gap-5 xl:grid-cols-3">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
