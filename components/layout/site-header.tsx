"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield, ShoppingBag, User2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { mainNav } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-provider";
import { BrandLogo } from "@/components/layout/brand-logo";

export function SiteHeader({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { count, setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-yisos-black/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <BrandLogo compact />

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm uppercase tracking-[0.18em] text-muted-foreground transition hover:text-yisos-gold",
                pathname === item.href && "text-yisos-gold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <User2 className="h-4 w-4" />
            </Link>
          </Button>
          {isAdmin ? (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <Shield className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
          <Button variant="outline" className="relative" onClick={() => setCartOpen(true)}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Cart
            {count > 0 ? (
              <span className="ml-2 rounded-full bg-yisos-gold px-2 py-0.5 text-xs text-yisos-black">{count}</span>
            ) : null}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="outline" className="relative" onClick={() => setCartOpen(true)}>
            <ShoppingBag className="h-4 w-4" />
            {count > 0 ? (
              <span className="ml-2 rounded-full bg-yisos-gold px-2 py-0.5 text-xs text-yisos-black">{count}</span>
            ) : null}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mt-10 flex flex-col gap-4">
                {mainNav.map((item) => (
                  <Link key={item.href} href={item.href} className="border-b border-border pb-3 font-display text-xl">
                    {item.label}
                  </Link>
                ))}
                <Link href="/account" className="border-b border-border pb-3 font-display text-xl">
                  Account
                </Link>
                {isAdmin ? (
                  <Link href="/admin" className="font-display text-xl">
                    Admin
                  </Link>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
