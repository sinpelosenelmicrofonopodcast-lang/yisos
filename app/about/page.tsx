import Image from "next/image";
import { VeteranOwnedBadge } from "@/components/brand/veteran-owned-badge";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";

export const metadata = buildMetadata({
  title: "About",
  description: "Meet Jesus Soto and the veteran-owned lounge culture behind YISOS CIGARS in Killeen, Texas.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Legacy"
        title="Veteran-Owned. Lounge-Built."
        description="YISOS CIGARS is rooted in service, brotherhood, and the kind of cigar lounge culture that keeps people coming back for one more hour."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr,1fr] lg:px-8">
        <div className="space-y-5 text-muted-foreground">
          <VeteranOwnedBadge compact />
          <p>
            YISOS CIGARS is owned by Jesus Soto, a retired U.S. Army veteran who made Killeen, Texas home after completing 20 years of service.
          </p>
          <p>
            The brand is built around the same values that shape a great lounge: discipline, hospitality, conversation, and the ritual of slowing down long enough to enjoy a proper cigar.
          </p>
          <p>
            Inside the lounge, guests can settle in for a game of dominoes or poker, catch the fight or their favorite team on TV, or simply relax with a favorite cigar and beverage. It is BYOB, built for unwinding, and meant to feel familiar from the moment you walk in.
          </p>
          <p>
            Personal lockers are also available for rent, giving regulars a secure place to store their sticks and essentials until the next visit. That is the culture behind YISOS: repeatable, personal, and rooted in real lounge life.
          </p>
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-yisos-charcoal/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Owner</p>
              <p className="mt-2 font-display text-2xl text-yisos-bone">Jesus Soto</p>
            </div>
            <div className="rounded-xl border border-border bg-yisos-charcoal/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Home Base</p>
              <p className="mt-2 font-display text-2xl text-yisos-bone">Killeen, Texas</p>
            </div>
            <div className="rounded-xl border border-border bg-yisos-charcoal/60 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Lounge Perks</p>
              <p className="mt-2 font-display text-2xl text-yisos-bone">BYOB + Lockers</p>
            </div>
          </div>
        </div>
        <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border">
          <Image
            src="/about-owner.jpg"
            alt="Jesus Soto holding a YISOS cigar"
            fill
            className="object-cover object-top"
          />
        </div>
      </section>
    </>
  );
}
