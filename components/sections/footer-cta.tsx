import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FooterCta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 md:px-8">
      <div className="surface-3 rounded-2xl border border-yisos-gold/35 p-8 text-center md:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-yisos-gold">Ready To Light Up?</p>
        <h3 className="mx-auto mt-3 max-w-3xl font-display text-4xl text-yisos-bone md:text-5xl">
          Elevate Tonight With A Cigar Worth Remembering
        </h3>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="luxury" size="lg">
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/membership">Join Club</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Concierge</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
