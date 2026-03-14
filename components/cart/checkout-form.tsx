"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { LoaderCircle, ShieldCheck, Wallet } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ShippingQuote } from "@/lib/services/usps-service";

const stripePromise =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : Promise.resolve(null);

export function CheckoutForm() {
  const { items, summary, promoCode, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("US");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "manual">("stripe");
  const [status, setStatus] = useState<string | null>(null);
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const isEmpty = useMemo(() => items.length === 0, [items]);
  const discountedSubtotal = useMemo(() => Math.max(summary.subtotal - summary.discount, 0), [summary.discount, summary.subtotal]);
  const quoteReady =
    shippingAddress1.trim().length >= 4 &&
    shippingCity.trim().length >= 2 &&
    shippingState.trim().length >= 2 &&
    shippingPostalCode.trim().length >= 4 &&
    shippingCountry.trim().toUpperCase() === "US" &&
    !isEmpty;
  const shippingTotal = quote?.shippingAmount ?? summary.shipping;
  const handlingTotal = quote?.handlingAmount ?? 0;
  const estimatedTotalBeforeTax = discountedSubtotal + shippingTotal + handlingTotal;
  const totalShippingCharge = shippingTotal + handlingTotal;

  const requestQuote = useCallback(async () => {
    if (!quoteReady) {
      setQuote(null);
      return null;
    }

    setQuoteLoading(true);

    try {
      const response = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal: discountedSubtotal,
          shipping: {
            shippingName,
            shippingAddress1,
            shippingAddress2,
            shippingCity,
            shippingState,
            shippingPostalCode,
            shippingCountry
          }
        })
      });

      const data = (await response.json().catch(() => null)) as ShippingQuote | { message?: string } | null;

      if (!response.ok || !data || !("carrier" in data)) {
        setQuote(null);
        setStatus((data && "message" in data && data.message) || "Unable to calculate USPS shipping.");
        return null;
      }

      setQuote(data);
      return data;
    } finally {
      setQuoteLoading(false);
    }
  }, [
    discountedSubtotal,
    items,
    quoteReady,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingCountry,
    shippingName,
    shippingPostalCode,
    shippingState
  ]);

  useEffect(() => {
    if (!quoteReady) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void requestQuote();
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [quoteReady, requestQuote]);

  const startCheckout = async () => {
    if (isEmpty) {
      setStatus("Cart is empty.");
      return;
    }

    if (!quoteReady) {
      setStatus("Complete a full US shipping address to calculate USPS shipping before checkout.");
      return;
    }

    setStatus("Preparing checkout...");
    const activeQuote = await requestQuote();

    if (quoteReady && !activeQuote) {
      setStatus("USPS shipping could not be calculated for this address.");
      return;
    }

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
          paymentMethod: "manual",
          shipping: {
            shippingName,
            shippingAddress1,
            shippingAddress2,
            shippingCity,
            shippingState,
            shippingPostalCode,
            shippingCountry
          }
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
          shippingAddress2,
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
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 pt-6 lg:grid-cols-[1fr,0.72fr] lg:gap-8 lg:px-8 lg:pb-20 lg:pt-10">
      <section className="space-y-6 rounded-xl border border-border bg-yisos-charcoal/70 p-5 md:p-6">
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
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address2">Address 2</Label>
            <Input
              id="address2"
              value={shippingAddress2}
              onChange={(event) => setShippingAddress2(event.target.value)}
              placeholder="Apartment, suite, unit, building"
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

        <Button variant="luxury" size="lg" className="w-full" onClick={startCheckout} disabled={isEmpty || quoteLoading}>
          <Wallet className="mr-2 h-4 w-4" /> Complete Checkout
        </Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        {quote?.warnings?.length ? (
          <div className="rounded-lg border border-border/70 bg-black/20 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-yisos-bone">USPS address notes</p>
            <ul className="mt-2 space-y-1">
              {quote.warnings.map((warning) => (
                <li key={warning}>- {warning}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <aside className="h-fit rounded-xl border border-border bg-yisos-charcoal/70 p-5 md:p-6 lg:sticky lg:top-28">
        <h3 className="font-display text-3xl text-yisos-bone">Order Summary</h3>
        <div className="mt-5 rounded-2xl border border-border/70 bg-black/20 p-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Merchandise</span>
              <span>{formatCurrency(summary.subtotal)}</span>
            </div>
            {summary.discount > 0 ? (
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span>-{formatCurrency(summary.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-muted-foreground">
              <span>USPS Shipping</span>
              <span>
                {quoteLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    Calculating
                  </span>
                ) : shippingTotal ? (
                  formatCurrency(shippingTotal)
                ) : (
                  "Free"
                )}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Handling</span>
              <span>{handlingTotal ? formatCurrency(handlingTotal) : "Included"}</span>
            </div>
            <div className="h-px bg-border/70" />
            <div className="flex justify-between text-sm text-yisos-bone/76">
              <span>Estimated tax</span>
              <span>Calculated securely at payment</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-yisos-bone">
              <span>Estimated Total</span>
              <span>{formatCurrency(estimatedTotalBeforeTax)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-border/70 bg-black/20 p-4 text-sm text-muted-foreground">
          {quote ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-yisos-bone">{quote.serviceName}</p>
                <span className="rounded-full border border-yisos-gold/30 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-yisos-gold">
                  {quote.carrier}
                </span>
              </div>
              <p className="mt-1">
                USPS validated to {quote.addressValidation?.address?.city}, {quote.addressValidation?.address?.state}{" "}
                {quote.addressValidation?.address?.ZIPCode}
                {quote.addressValidation?.address?.ZIPPlus4 ? `-${quote.addressValidation.address.ZIPPlus4}` : ""}
              </p>
              {quote.freeShippingApplied ? (
                <p className="mt-2 text-yisos-gold">Free shipping threshold applied. Only handling is being charged.</p>
              ) : null}
              {!quote.freeShippingApplied ? (
                <p className="mt-2 text-yisos-bone/70">Shipping and handling today: {formatCurrency(totalShippingCharge)}</p>
              ) : null}
            </>
          ) : (
            <p>Enter a complete US shipping address to calculate live USPS shipping and handling.</p>
          )}
          <p className="mt-2">Tax is finalized securely during payment confirmation.</p>
        </div>

        <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-yisos-gold" /> Secure encrypted checkout, age-gated purchase flow.
        </p>
      </aside>
    </div>
  );
}
