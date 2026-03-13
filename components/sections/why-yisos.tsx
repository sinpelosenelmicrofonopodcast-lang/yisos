import { Leaf, Shield, Trophy } from "lucide-react";
import { VeteranOwnedBadge } from "@/components/brand/veteran-owned-badge";
import { SectionHeading } from "@/components/sections/section-heading";

const points = [
  {
    icon: Leaf,
    title: "Crafted Like A Private Reserve",
    body: "Every blend is selected for complexity, combustion, and finish. Nothing enters the collection unless it earns a longer evening."
  },
  {
    icon: Shield,
    title: "Precision In Every Touchpoint",
    body: "From box construction to checkout pacing, YISOS is built with disciplined restraint, not smoke-shop excess."
  },
  {
    icon: Trophy,
    title: "A Lounge-Level Identity",
    body: "The brand is built around ritual, conversation, whiskey, low light, and the feeling of stepping into a private club."
  }
];

export function WhyYisos() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <SectionHeading
        eyebrow="Why YISOS"
        title="Built For Men Who Smoke With Intention"
        description="We combine modern luxury with old-world cigar culture to create a premium ritual worth repeating."
      />
      <div className="mt-8">
        <VeteranOwnedBadge />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {points.map((point) => (
          <article key={point.title} className="surface-1 rounded-xl border border-border p-6">
            <point.icon className="h-6 w-6 text-yisos-gold" />
            <h3 className="mt-4 font-display text-2xl text-yisos-stitch">{point.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-yisos-bone/80">{point.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
