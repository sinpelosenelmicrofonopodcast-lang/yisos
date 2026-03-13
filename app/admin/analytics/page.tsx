import { getAnalyticsSnapshot } from "@/lib/services/admin-service";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const stats = await getAnalyticsSnapshot();

  const cards = [
    { label: "Revenue", value: formatCurrency(stats.revenue) },
    { label: "Orders", value: String(stats.orders) },
    { label: "Email Subscribers", value: String(stats.subscribers) },
    { label: "Push Subscribers", value: String(stats.pushSubscribers) }
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-yisos-bone">Analytics Snapshot</h1>
      {!stats.configured ? (
        <div className="surface-1 mt-6 rounded-2xl border border-border p-6 text-sm text-yisos-bone/78">
          Supabase is not configured yet. Analytics will appear when the project is connected and real data exists.
        </div>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="bg-yisos-charcoal/70">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{card.label}</p>
              <p className="mt-3 font-display text-4xl text-yisos-bone">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
