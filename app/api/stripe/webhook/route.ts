import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/services/stripe-service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { orderConfirmationTemplate } from "@/lib/emails/templates";
import { sendTransactionalEmail } from "@/lib/services/email-service";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    return NextResponse.json({ message: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Missing stripe signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    return NextResponse.json({ message: "Invalid webhook payload", error }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const supabase = getSupabaseAdminClient();

    const orderNumber = `YIS-${session.id.slice(-8).toUpperCase()}`;

    if (supabase) {
      await supabase.from("orders").insert({
        user_id: session.metadata?.userId === "guest" ? null : session.metadata?.userId,
        order_number: orderNumber,
        stripe_session_id: session.id,
        payment_status: "paid",
        fulfillment_status: "processing",
        subtotal: Number((session.amount_subtotal || 0) / 100),
        tax: Number((session.total_details?.amount_tax || 0) / 100),
        shipping: Number((session.total_details?.amount_shipping || 0) / 100),
        discount: Number((session.total_details?.amount_discount || 0) / 100),
        total: Number((session.amount_total || 0) / 100),
        currency: (session.currency || "usd").toUpperCase(),
        customer_email: session.customer_details?.email || null
      });
    }

    if (session.customer_details?.email) {
      const tpl = orderConfirmationTemplate(orderNumber, Number((session.amount_total || 0) / 100));
      await sendTransactionalEmail({
        to: session.customer_details.email,
        subject: tpl.subject,
        html: tpl.html
      });
    }
  }

  return NextResponse.json({ received: true });
}
