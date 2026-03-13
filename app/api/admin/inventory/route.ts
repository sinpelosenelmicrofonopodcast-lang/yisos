import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function PATCH(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    productId?: string;
    stock?: number;
    reorderThreshold?: number;
    backorderAllowed?: boolean;
  } | null;

  if (!body?.productId) {
    return NextResponse.json({ message: "productId is required" }, { status: 400 });
  }

  const { error } = await admin.supabase.from("inventory").upsert(
    {
      product_id: body.productId,
      stock: Number(body.stock ?? 0),
      reorder_threshold: Number(body.reorderThreshold ?? 10),
      backorder_allowed: Boolean(body.backorderAllowed)
    },
    { onConflict: "product_id" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
