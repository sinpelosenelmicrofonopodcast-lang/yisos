import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";
import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your order with secure Stripe checkout, Apple Pay, Google Pay, and PayPal-ready support.",
  path: "/checkout"
});

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Secure Purchase"
        description="Guest or account checkout with shipping, tax, promo support, and premium payment options."
      />
      <CheckoutForm />
    </>
  );
}
