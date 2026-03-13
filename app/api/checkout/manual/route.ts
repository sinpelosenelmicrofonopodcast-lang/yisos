import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/services/auth-service";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    items?: Array<{ productId: string; quantity: number; price: number; name: string }>;
    email?: string;
    total?: number;
    paymentMethod?: string;
  } | null;

  if (!body?.items?.length || !body?.total) {
    return NextResponse.json({ message: "Invalid order payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const user = await getCurrentUser();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase not configured" }, { status: 500 });
  }

  const orderNumber = `YIS-M-${Date.now().toString().slice(-8)}`;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id || null,
      order_number: orderNumber,
      payment_status: "pending",
      fulfillment_status: "pending_review",
      subtotal: Number(body.total),
      tax: 0,
      shipping: 0,
      total: Number(body.total),
      currency: "USD",
      customer_email: body.email || null,
      payment_method: body.paymentMethod || "manual"
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
