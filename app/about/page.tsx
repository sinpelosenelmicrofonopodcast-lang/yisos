import Image from "next/image";
import { VeteranOwnedBadge } from "@/components/brand/veteran-owned-badge";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";

export const metadata = buildMetadata({
  title: "About",
  description: "The story behind YISOS CIGARS and the ritual-first philosophy.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Legacy"
        title="A Premium Ritual House"
        description="YISOS CIGARS exists to turn every smoke into a deliberate moment of style, calm, and identity."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr,1fr] lg:px-8">
        <div className="space-y-5 text-muted-foreground">
          <VeteranOwnedBadge compact />
          <p>
            Built from lounge culture and modern discipline, YISOS combines old-world cigar tradition with luxury-grade digital experience.
          </p>
          <p>
            We source from respected growing regions, test each profile for consistency, and release only blends that hold character from first third to final inch.
          </p>
          <p>
            Every product page, package, and post-purchase touchpoint is designed to feel intentional, masculine, and unmistakably premium.
          </p>
        </div>
        <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border">
          <Image
            src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1500&q=80"
            alt="YISOS lounge"
            fill
            className="object-cover"
          />
        </div>
      </section>
    </>
  );
}
