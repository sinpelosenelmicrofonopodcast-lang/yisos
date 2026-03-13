import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    marketingOptIn?: boolean;
    orderUpdatesOptIn?: boolean;
    pushOptIn?: boolean;
  } | null;

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ success: true });
  }

  await supabase
    .from("profiles")
    .update({
      marketing_opt_in: Boolean(body?.marketingOptIn),
      order_updates_opt_in: Boolean(body?.orderUpdatesOptIn),
      push_opt_in: Boolean(body?.pushOptIn)
    })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
