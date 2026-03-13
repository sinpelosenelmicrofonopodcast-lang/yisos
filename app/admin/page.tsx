import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const cards = [
  {
    title: "Products",
    body: "Manage catalog, pricing, inventory, and images.",
    href: "/admin/products"
  },
  {
    title: "Orders",
    body: "Review payments, fulfillment states, and manual orders.",
    href: "/admin/orders"
  },
  {
    title: "Customers",
    body: "Track memberships, profiles, and subscriber activity.",
    href: "/admin/customers"
  },
  {
    title: "Notifications",
    body: "Send push campaigns and transactional updates.",
    href: "/admin/notifications"
  }
];

export default function AdminPage() {
  return (
    <div>
      <h1 className="font-display text-5xl text-yisos-bone">Admin Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="h-full bg-yisos-charcoal/70 transition hover:border-yisos-gold/40">
              <CardContent className="p-6">
                <p className="font-display text-3xl text-yisos-bone">{card.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
