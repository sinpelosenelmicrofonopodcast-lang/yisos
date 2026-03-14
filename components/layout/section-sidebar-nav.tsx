"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SectionSidebarNavProps {
  label: string;
  links: { href: string; label: string }[];
}

export function SectionSidebarNav({ label, links }: SectionSidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-[1.25rem] border border-border bg-yisos-charcoal/80 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <p className="mb-4 text-xs uppercase tracking-[0.28em] text-yisos-gold">{label}</p>
      <nav className="space-y-1.5">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== `/${label.toLowerCase()}` && pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block rounded-xl border px-3 py-2.5 text-sm transition",
                active
                  ? "border-yisos-gold/50 bg-gradient-to-r from-yisos-tobacco/70 to-yisos-charcoal text-yisos-bone shadow-[0_10px_30px_rgba(200,148,52,0.12)]"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-black/25 hover:text-yisos-bone"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
