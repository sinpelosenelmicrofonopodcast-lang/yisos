import Link from "next/link";
import { ArrowRight, Bell, Boxes, ChartNoAxesCombined, PackageCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getAdminCustomers, getAdminOrders, getAdminProducts, getAnalyticsSnapshot } from "@/lib/services/admin-service";

const cards = [
  {
    title: "Products",
    body: "Manage catalog, pricing, inventory, categories, and image sets.",
    href: "/admin/products",
    icon: Boxes
  },
  {
    title: "Orders",
    body: "Review payment state, fulfillment progress, shipping, and manual orders.",
    href: "/admin/orders",
    icon: PackageCheck
  },
  {
    title: "Customers",
    body: "Track memberships, profiles, retention activity, and subscriber quality.",
    href: "/admin/customers",
    icon: Users
  },
  {
    title: "Notifications",
    body: "Send OneSignal campaigns, drop alerts, and brand updates.",
    href: "/admin/notifications",
    icon: Bell
  }
];

export default async function AdminPage() {
  const [stats, products, orders, customers] = await Promise.all([
    getAnalyticsSnapshot(),
    getAdminProducts(),
    getAdminOrders(),
    getAdminCustomers()
  ]);

  const productCount = products.length;
  const orderCount = orders.length;
  const customerCount = customers.length;
  const lowStockCount = products.filter((product) => product.stock < 15).length;

  const statCards = [
    { label: "Revenue Captured", value: formatCurrency(stats.revenue), detail: `${stats.orders} paid orders tracked` },
    { label: "Live Catalog", value: String(productCount), detail: `${lowStockCount} low-stock SKUs need attention` },
    { label: "Customer Profiles", value: String(customerCount), detail: `${stats.subscribers} email subscribers on file` },
    { label: "Push Audience", value: String(stats.pushSubscribers), detail: `${orderCount} latest orders visible to ops` }
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-[linear-gradient(135deg,rgba(31,26,22,0.95),rgba(10,10,10,0.98)),radial-gradient(circle_at_top_right,rgba(200,148,52,0.16),transparent_30%)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-yisos-gold">Operations Console</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl text-yisos-bone md:text-5xl">Admin Dashboard</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-yisos-bone/72 md:text-[15px]">
              Run catalog, customers, and fulfillment from one place. Prioritize low inventory, review new orders,
              and keep the YISOS buying experience tight.
            </p>
          </div>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-2 rounded-full border border-yisos-gold/40 px-4 py-2 text-sm text-yisos-bone transition hover:border-yisos-gold hover:bg-yisos-gold/10"
          >
            <ChartNoAxesCombined className="h-4 w-4 text-yisos-gold" />
            Open Analytics
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="surface-1 border-border/80 bg-yisos-charcoal/80">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-yisos-gold">{card.label}</p>
              <p className="mt-3 font-display text-4xl text-yisos-bone">{card.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="h-full border-border/80 bg-yisos-charcoal/75 transition hover:-translate-y-1 hover:border-yisos-gold/40">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-3xl text-yisos-bone">{card.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  </div>
                  <card.icon className="h-5 w-5 text-yisos-gold" />
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-yisos-gold">
                  Open section <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
