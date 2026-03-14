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
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.05fr,0.95fr] lg:px-8">
        <div className="space-y-6">
          <VeteranOwnedBadge compact />
          <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
            <p className="font-display text-4xl leading-tight text-yisos-bone md:text-5xl">
              Built on service, lounge culture, and the habit of staying one round longer.
            </p>
            <p>
              YISOS CIGARS is owned by Jesus Soto, a retired U.S. Army veteran who made Killeen, Texas home after completing 20 years of service.
            </p>
            <p>
              The lounge runs on discipline and hospitality in equal measure. It is a place to slow the pace, light a proper cigar, and settle into conversation without the noise and clutter of a typical smoke shop.
            </p>
            <p>
              Guests come through for dominoes, poker, the night&apos;s game on TV, or a quiet seat with their favorite stick and beverage. It is BYOB, comfortable by design, and built to feel familiar from the moment you walk in.
            </p>
            <p>
              Personal lockers are available for rent so regulars can store what matters safely and return to the same ritual the next time they step inside.
            </p>
          </div>
          <div className="grid gap-4 pt-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-yisos-charcoal/60 p-5 shadow-panel">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Owner</p>
              <p className="mt-3 font-display text-2xl text-yisos-bone">Jesus Soto</p>
            </div>
            <div className="rounded-2xl border border-border bg-yisos-charcoal/60 p-5 shadow-panel">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Home Base</p>
              <p className="mt-3 font-display text-2xl text-yisos-bone">Killeen, Texas</p>
            </div>
            <div className="rounded-2xl border border-border bg-yisos-charcoal/60 p-5 shadow-panel">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Lounge Perks</p>
              <p className="mt-3 font-display text-2xl text-yisos-bone">BYOB + Lockers</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-yisos-gold/20 bg-gradient-to-br from-yisos-gold/10 to-transparent blur-[2px]" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-yisos-charcoal shadow-panel">
            <div className="relative h-[520px]">
              <Image
                src="/about-owner.jpg"
                alt="Jesus Soto holding a YISOS cigar"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yisos-black via-yisos-black/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="rounded-2xl border border-border/80 bg-yisos-black/75 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.24em] text-yisos-gold">Founder</p>
                <p className="mt-2 font-display text-3xl text-yisos-bone">Jesus Soto</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-yisos-bone/75">
                  Retired U.S. Army veteran. Lounge host. Builder of a cigar house shaped by routine, conversation, and repeat visits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
