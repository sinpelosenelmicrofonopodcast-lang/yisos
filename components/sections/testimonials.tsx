import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types";

export function Testimonials({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <p className="text-xs uppercase tracking-[0.28em] text-yisos-gold">Social Proof</p>
      <h3 className="mt-3 font-display text-4xl text-yisos-bone">Trusted By Discerning Smokers</h3>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id} className="surface-1">
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed text-yisos-bone/80">“{review.comment}”</p>
              <p className="mt-5 font-semibold text-yisos-stitch">{review.userName}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-yisos-bone/70">{review.rating}/5 Verified Review</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
