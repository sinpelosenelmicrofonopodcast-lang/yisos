import { HomeHero } from "@/components/sections/home-hero";
import { FeaturedCollections } from "@/components/sections/featured-collections";
import { WhyYisos } from "@/components/sections/why-yisos";
import { LifestyleStrip } from "@/components/sections/lifestyle-strip";
import { MembershipCta } from "@/components/sections/membership-cta";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { Testimonials } from "@/components/sections/testimonials";
import { FooterCta } from "@/components/sections/footer-cta";
import { getProducts } from "@/lib/services/product-service";
import { getHomepageReviews } from "@/lib/services/review-service";
import { ProductReveal } from "@/components/sections/product-reveal";
import { PairingGuide } from "@/components/sections/pairing-guide";
import { ConciergeExperience } from "@/components/sections/concierge-experience";
import { BestSellersCarousel } from "@/components/sections/best-sellers-carousel";

export default async function HomePage() {
  const [products, homepageReviews] = await Promise.all([getProducts(), getHomepageReviews()]);

  return (
    <>
      <HomeHero />
      <FeaturedCollections products={products} />
      <WhyYisos />
      <ProductReveal products={products} />
      <BestSellersCarousel products={products} />
      <PairingGuide />
      <LifestyleStrip />
      <MembershipCta />
      <ConciergeExperience />
      <NewsletterSection />
      <Testimonials reviews={homepageReviews} />
      <FooterCta />
    </>
  );
}
