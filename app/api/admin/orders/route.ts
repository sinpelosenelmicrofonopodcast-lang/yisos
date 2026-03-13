import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function PATCH(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    orderId?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
    notes?: string;
  } | null;

  if (!body?.orderId) {
    return NextResponse.json({ message: "orderId is required" }, { status: 400 });
  }

  const { error } = await admin.supabase
    .from("orders")
    .update({
      payment_status: body.paymentStatus,
      fulfillment_status: body.fulfillmentStatus,
      notes: body.notes
    })
    .eq("id", body.orderId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
