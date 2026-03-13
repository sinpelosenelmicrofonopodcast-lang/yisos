"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CartPageClient() {
  const { items, removeItem, updateQuantity, summary, applyPromoCode, promoCode, discount } = useCart();
  const [code, setCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<string | null>(null);

  const onApply = async () => {
    const result = await applyPromoCode(code);
    setPromoStatus(result.message);
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-20 pt-10 lg:grid-cols-[1.2fr,0.8fr] lg:px-8">
      <div className="space-y-4">
        {items.length ? (
          items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-xl border border-border bg-yisos-charcoal/70 p-4">
              <div className="relative h-28 w-28 overflow-hidden rounded-lg">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Link href={`/shop/${item.slug}`} className="font-display text-2xl text-yisos-bone hover:text-yisos-gold">
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                <div className="mt-auto flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-8 text-center text-muted-foreground">
            Your cart is empty. Explore the collection.
          </div>
        )}
      </div>

      <aside className="h-fit rounded-xl border border-border bg-yisos-charcoal/70 p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-3xl text-yisos-bone">Order Summary</h2>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{summary.shipping ? formatCurrency(summary.shipping) : "Free"}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>{formatCurrency(summary.tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-yisos-bone">
            <span>Total</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Input
            placeholder="Promo or Gift Card"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <Button variant="outline" className="w-full" onClick={onApply}>
            Apply Code
          </Button>
          {promoCode ? <p className="text-xs text-yisos-gold">Applied: {promoCode}</p> : null}
          {promoStatus ? <p className="text-xs text-muted-foreground">{promoStatus}</p> : null}
        </div>

        <Button asChild className="mt-6 w-full" variant="luxury" size="lg" disabled={!items.length}>
          <Link href="/checkout">Proceed To Checkout</Link>
        </Button>
      </aside>
    </div>
  );
}
