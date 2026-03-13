import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: string; subtotal?: number } | null;

  const code = body?.code?.toUpperCase().trim();
  const subtotal = Number(body?.subtotal || 0);

  if (!code) {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase is not configured" }, { status: 503 });
  }

  const { data } = await supabase
    .from("promo_codes")
    .select("code, discount_type, discount_value, minimum_subtotal, active, starts_at, ends_at")
    .eq("code", code)
    .eq("active", true)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ message: "Promo code not found" }, { status: 404 });
  }

  const minSubtotal = Number(data.minimum_subtotal || 0);
  if (subtotal < minSubtotal) {
    return NextResponse.json(
      { message: `Minimum subtotal of $${minSubtotal.toFixed(2)} required` },
      { status: 400 }
    );
  }

  const discount =
    data.discount_type === "percent"
      ? (subtotal * Number(data.discount_value || 0)) / 100
      : Number(data.discount_value || 0);

  return NextResponse.json({ code, discount: Number(discount.toFixed(2)) });
}
