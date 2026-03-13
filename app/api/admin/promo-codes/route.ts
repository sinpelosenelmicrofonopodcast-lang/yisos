import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    code?: string;
    discountType?: "percent" | "fixed";
    discountValue?: number;
    minimumSubtotal?: number;
    description?: string;
  } | null;

  if (!body?.code || !body.discountType || body.discountValue === undefined) {
    return NextResponse.json({ message: "Missing promo fields" }, { status: 400 });
  }

  const { error } = await admin.supabase.from("promo_codes").upsert(
    {
      code: body.code.toUpperCase(),
      discount_type: body.discountType,
      discount_value: Number(body.discountValue),
      minimum_subtotal: Number(body.minimumSubtotal || 0),
      description: body.description || null,
      active: true
    },
    { onConflict: "code" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
