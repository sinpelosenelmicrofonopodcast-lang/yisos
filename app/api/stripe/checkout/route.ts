import { NextResponse } from "next/server";
import { buildLineItems, getStripeClient } from "@/lib/services/stripe-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { CartItem } from "@/types";
import { getShippingQuote, type CheckoutShippingAddress } from "@/lib/services/usps-service";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    items?: CartItem[];
    promoCode?: string;
    giftCardCode?: string;
    customerEmail?: string;
    shipping?: CheckoutShippingAddress;
  } | null;

  const items = body?.items || [];

  if (!items.length) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  const stripe = getStripeClient();

  if (!stripe) {
    return NextResponse.json({ message: "Stripe not configured" }, { status: 500 });
  }

  const user = await getCurrentUser();
  const supabase = getSupabaseAdminClient();
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  let metadataDiscount = 0;

  if (supabase && body?.giftCardCode) {
    const { data } = await supabase
      .from("gift_cards")
      .select("id, code, balance, is_active")
      .eq("code", body.giftCardCode.toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (data?.balance) {
      metadataDiscount += Number(data.balance);
    }
  }

  try {
    const shippingQuote = body?.shipping
      ? await getShippingQuote({
          items,
          subtotal: Math.max(subtotal - metadataDiscount, 0),
          address: body.shipping
        })
      : null;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: buildLineItems(items),
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=1`,
      shipping_address_collection: {
        allowed_countries: ["US"]
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shippingQuote
              ? shippingQuote.handlingAmount > 0
                ? `${shippingQuote.serviceName} + Handling`
                : shippingQuote.serviceName
              : "Standard Shipping",
            fixed_amount: {
              amount: Math.round(
                ((shippingQuote?.shippingAmount || 0) + (shippingQuote?.handlingAmount || 0)) * 100
              ),
              currency: "usd"
            },
            tax_behavior: "exclusive"
          }
        }
      ],
      automatic_tax: {
        enabled: true
      },
      allow_promotion_codes: true,
      customer_email: body?.customerEmail,
      metadata: {
        userId: user?.id || "guest",
        promoCode: body?.promoCode || "",
        giftCardCode: body?.giftCardCode || "",
        manualDiscount: String(metadataDiscount),
        shippingCarrier: shippingQuote?.carrier || "",
        shippingService: shippingQuote?.serviceName || "",
        shippingAmount: String(shippingQuote?.shippingAmount || 0),
        handlingAmount: String(shippingQuote?.handlingAmount || 0)
      },
      phone_number_collection: {
        enabled: true
      }
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Checkout unavailable" },
      { status: 400 }
    );
  }
}
