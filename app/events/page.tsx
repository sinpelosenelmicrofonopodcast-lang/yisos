import Image from "next/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";
import { getEvents } from "@/lib/services/event-service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Events",
  description: "Private lounge events, tastings, and limited release nights from YISOS.",
  path: "/events"
});

export default async function EventsPage() {
  const items = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="Experiences"
        title="YISOS Events"
        description="Exclusive tastings, pairing nights, and member-led lounge gatherings."
      />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-16 md:grid-cols-2 md:px-8">
        {items.length ? (
          items.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-2xl border border-border bg-yisos-charcoal/70">
              <div className="relative h-64">
                <Image src={event.featuredImage} alt={event.title} fill className="object-cover" />
              </div>
              <div className="space-y-3 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-yisos-gold">{formatDate(event.date)}</p>
                <h2 className="font-display text-3xl text-yisos-bone">{event.title}</h2>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
                <p className="font-semibold text-yisos-bone">{formatCurrency(event.ticketPrice)}</p>
                <Button variant="luxury">Reserve Seat</Button>
              </div>
            </article>
          ))
        ) : (
          <div className="surface-1 rounded-2xl border border-border p-8 text-sm text-yisos-bone/78 md:col-span-2">
            No live events are published in Supabase yet.
          </div>
        )}
      </section>
    </>
  );
}
