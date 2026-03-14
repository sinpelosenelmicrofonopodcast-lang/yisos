import { Leaf, Shield, Trophy } from "lucide-react";
import { VeteranOwnedBadge } from "@/components/brand/veteran-owned-badge";
import { SectionHeading } from "@/components/sections/section-heading";

const points = [
  {
    icon: Leaf,
    title: "Built Around Real Lounge Ritual",
    body: "This brand is not styled after lounge culture from a distance. It comes directly from nights built around cigars, conversation, card tables, and one more pour."
  },
  {
    icon: Shield,
    title: "Veteran-Owned Discipline",
    body: "YISOS carries the tone of a house built by a retired U.S. Army veteran: intentional, steady, and never casual about the details."
  },
  {
    icon: Trophy,
    title: "Private-Club Familiarity",
    body: "BYOB nights, personal lockers, premium blends, and a room that rewards regulars. The goal is to feel personal, not transactional."
  }
];

export function WhyYisos() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <SectionHeading
        eyebrow="Why YISOS"
        title="Built For Men Who Smoke With Intention"
        description="Veteran-owned, lounge-shaped, and built to feel more like a private room than a retail counter."
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
