"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ShieldCheck, Wallet } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const stripePromise =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : Promise.resolve(null);

export function CheckoutForm() {
  const { items, summary, promoCode, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("US");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "manual">("stripe");
  const [status, setStatus] = useState<string | null>(null);

  const isEmpty = useMemo(() => items.length === 0, [items]);

  const startCheckout = async () => {
    if (isEmpty) {
      setStatus("Cart is empty.");
      return;
    }

    setStatus("Preparing checkout...");

    if (paymentMethod === "manual") {
      const response = await fetch("/api/checkout/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          total: summary.total,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          })),
          paymentMethod: "manual"
        })
      });

      if (!response.ok) {
        setStatus("Unable to submit manual order.");
        return;
      }

      clearCart();
      window.location.href = "/order-confirmation?manual=1";
      return;
    }

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        promoCode,
        customerEmail: email,
        shipping: {
          shippingName,
          shippingAddress1,
          shippingCity,
          shippingState,
          shippingPostalCode,
          shippingCountry
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: "Checkout unavailable" }));
      setStatus(err.message || "Checkout unavailable");
      return;
    }

    const data = (await response.json()) as { url?: string };

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    const stripe = await stripePromise;

    if (!stripe) {
      setStatus("Stripe client not configured.");
      return;
    }

    setStatus("Unable to redirect to checkout.");
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-20 pt-10 lg:grid-cols-[1fr,0.72fr] lg:px-8">
      <section className="space-y-6 rounded-xl border border-border bg-yisos-charcoal/70 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-yisos-gold">Secure Checkout</p>
          <h2 className="mt-2 font-display text-4xl text-yisos-bone">Shipping & Payment</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={shippingName} onChange={(event) => setShippingName(event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={shippingAddress1}
              onChange={(event) => setShippingAddress1(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={shippingCity} onChange={(event) => setShippingCity(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" value={shippingState} onChange={(event) => setShippingState(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">Postal Code</Label>
            <Input
              id="zip"
              value={shippingPostalCode}
              onChange={(event) => setShippingPostalCode(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={shippingCountry}
              onChange={(event) => setShippingCountry(event.target.value.toUpperCase())}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Payment Method</Label>
          <label className="flex items-center gap-3 rounded-md border border-border p-3 text-sm">
            <input
              type="radio"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />
            Stripe Checkout (Card, Apple Pay, Google Pay, eligible PayPal via Stripe)
          </label>
          <label className="flex items-center gap-3 rounded-md border border-border p-3 text-sm">
            <input
              type="radio"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            PayPal Express (through enabled Stripe wallet methods)
          </label>
          <label className="flex items-center gap-3 rounded-md border border-border p-3 text-sm">
            <input
              type="radio"
              checked={paymentMethod === "manual"}
              onChange={() => setPaymentMethod("manual")}
            />
            Local Manual Payment (admin review)
          </label>
        </div>

        <Button variant="luxury" size="lg" className="w-full" onClick={startCheckout} disabled={isEmpty}>
          <Wallet className="mr-2 h-4 w-4" /> Complete Checkout
        </Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </section>

      <aside className="h-fit rounded-xl border border-border bg-yisos-charcoal/70 p-6 lg:sticky lg:top-28">
        <h3 className="font-display text-3xl text-yisos-bone">Order Summary</h3>
        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(summary.subtotal)}</span>
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

        <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-yisos-gold" /> Secure encrypted checkout, age-gated purchase flow.
        </p>
      </aside>
    </div>
  );
}
