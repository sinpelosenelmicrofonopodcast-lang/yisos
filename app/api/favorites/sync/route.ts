import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: true });
  }

  const body = (await request.json().catch(() => null)) as { productId?: string; active?: boolean } | null;

  if (!body?.productId) {
    return NextResponse.json({ message: "productId required" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ success: true });
  }

  if (body.active) {
    await supabase.from("favorites").upsert(
      {
        user_id: user.id,
        product_id: body.productId
      },
      { onConflict: "user_id,product_id" }
    );
  } else {
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", body.productId);
  }

  return NextResponse.json({ success: true });
}
