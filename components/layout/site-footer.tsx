import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import { BrandLogo } from "@/components/layout/brand-logo";
import { VeteranOwnedBadge } from "@/components/brand/veteran-owned-badge";

const footerCols = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Cigars" },
      { href: "/membership", label: "VIP Membership" },
      { href: "/gift-cards", label: "Gift Cards" }
    ]
  },
  {
    title: "Experience",
    links: [
      { href: "/events", label: "Events" },
      { href: "/about", label: "Our Story" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    title: "Support",
    links: [
      { href: "/account/orders", label: "Track Orders" },
      { href: "/account/notifications", label: "Notifications" },
      { href: "/checkout", label: "Checkout" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-yisos-black/92">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr,2fr]">
          <div>
            <BrandLogo className="w-fit" />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Crafted for modern ritual. Premium cigars, private drops, and a lounge-first brand experience built for collectors.
            </p>
            <VeteranOwnedBadge compact variant="mono" className="mt-5" />
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-yisos-gold">21+ only. Smoke responsibly.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerCols.map((column) => (
              <div key={column.title}>
                <p className="font-display text-lg text-yisos-bone">{column.title}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-yisos-bone/78 transition hover:text-yisos-gold">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            {new Date().getFullYear()} {siteConfig.name}. All rights reserved. {siteConfig.email}
          </p>
        </div>
      </div>
    </footer>
  );
}
