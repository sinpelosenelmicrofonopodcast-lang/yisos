import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata = buildMetadata({
  title: "Cart",
  description: "Review your cigar selections, apply promo codes, and proceed to secure checkout.",
  path: "/cart"
});

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Your Selection"
        description="Review quantities, apply promotions or gift cards, and checkout securely."
      />
      <CartPageClient />
    </>
  );
}
