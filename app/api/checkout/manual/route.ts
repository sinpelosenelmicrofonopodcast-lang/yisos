import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getShippingQuote, type CheckoutShippingAddress } from "@/lib/services/usps-service";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    items?: Array<{ productId: string; quantity: number; price: number; name: string }>;
    email?: string;
    total?: number;
    paymentMethod?: string;
    shipping?: CheckoutShippingAddress;
  } | null;

  if (!body?.items?.length) {
    return NextResponse.json({ message: "Invalid order payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const user = await getCurrentUser();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase not configured" }, { status: 500 });
  }

  const orderNumber = `YIS-M-${Date.now().toString().slice(-8)}`;
  const subtotal = body.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shippingQuote = body.shipping
    ? await getShippingQuote({
        items: body.items.map((item) => ({
          ...item,
          slug: item.productId,
          image: "",
          stock: 999
        })),
        subtotal,
        address: body.shipping
      }).catch(() => null)
    : null;
  const shipping = Number(shippingQuote?.shippingAmount || 0) + Number(shippingQuote?.handlingAmount || 0);
  const total = Number((subtotal + shipping).toFixed(2));

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id || null,
      order_number: orderNumber,
      payment_status: "pending",
      fulfillment_status: "pending_review",
      subtotal,
      tax: 0,
      shipping,
      total,
      currency: "USD",
      customer_email: body.email || null,
      payment_method: body.paymentMethod || "manual",
      shipping_address: body.shipping || null,
      notes: shippingQuote
        ? `Carrier: ${shippingQuote.carrier}; Service: ${shippingQuote.serviceName}; Handling: ${shippingQuote.handlingAmount}`
        : null
    })
    .select("id")
    .single();

  if (error || !order) {
    return NextResponse.json({ message: "Unable to create order" }, { status: 500 });
  }

  await supabase.from("order_items").insert(
    body.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
      product_name: item.name
    }))
  );

  return NextResponse.json({ success: true, orderNumber });
}
