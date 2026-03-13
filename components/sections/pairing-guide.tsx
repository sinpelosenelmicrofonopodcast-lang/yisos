import { GlassWater, MoonStar, TimerReset } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";

const pairings = [
  {
    icon: GlassWater,
    title: "Whiskey Pairing Guide",
    body: "Medium-full cigars find their best voice with warm oak, caramel, and leather-forward pours.",
    pair: "Imperial Noir + Highland single malt"
  },
  {
    icon: MoonStar,
    title: "Late-Night Lounge Mood",
    body: "Low light, conversation, and a slower burn. Choose a fuller profile when the night stretches long.",
    pair: "Commandante Gordo + dark rum"
  },
  {
    icon: TimerReset,
    title: "Ritual Timing",
    body: "Short-format blends belong to the early evening. Churchill and Toro formats own the deeper hours.",
    pair: "Gold Reserve + aged bourbon"
  }
];

export function PairingGuide() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr,1.15fr]">
        <SectionHeading
          eyebrow="Pairing Guide"
          title="Whiskey, Time, And Atmosphere Matter"
          description="The right cigar is never just flavor. It is context, pacing, light, glassware, and the way the room feels after dark."
        />
        <div className="grid gap-4">
          {pairings.map((item) => (
            <article key={item.title} className="surface-1 rounded-2xl border border-border/85 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-yisos-gold/25 bg-black/20 p-3 text-yisos-gold">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-yisos-stitch">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-yisos-bone/78">{item.body}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-yisos-gold">{item.pair}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
