import Link from "next/link";

export const dynamic = "force-dynamic";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/favorites", label: "Favorites" },
  { href: "/account/notifications", label: "Notifications" }
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-[230px,1fr] md:px-8">
      <aside className="h-fit rounded-xl border border-border bg-yisos-charcoal/70 p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-yisos-gold">Account</p>
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
