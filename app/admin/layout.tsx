import Link from "next/link";
import { requireAdmin } from "@/lib/services/auth-service";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/analytics", label: "Analytics" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-[240px,1fr] md:px-8">
      <aside className="h-fit rounded-xl border border-border bg-yisos-charcoal/70 p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-yisos-gold">Admin</p>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-yisos-bone"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
