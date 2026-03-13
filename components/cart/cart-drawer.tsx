"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, summary, cartOpen, setCartOpen, updateQuantity, removeItem, count } = useCart();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex flex-col">
        <SheetTitle className="font-display text-2xl text-yisos-bone">Your Selection ({count})</SheetTitle>

        <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="rounded-lg border border-border bg-yisos-black/40 p-6 text-sm text-muted-foreground">
              Your cart is empty. Discover limited blends in the shop.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="rounded-lg border border-border bg-yisos-black/40 p-3">
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link href={`/shop/${item.slug}`} className="text-sm font-semibold hover:text-yisos-gold">
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{summary.shipping === 0 ? "Free" : formatCurrency(summary.shipping)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Tax</span>
            <span>{formatCurrency(summary.tax)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold text-yisos-bone">
            <span>Total</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Button asChild variant="luxury" size="lg" className="w-full" disabled={items.length === 0}>
            <Link href="/checkout">Checkout Securely</Link>
          </Button>
          <Button asChild variant="outline" className="w-full" onClick={() => setCartOpen(false)}>
            <Link href="/cart">View Full Cart</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
