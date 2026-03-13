import { NextResponse } from "next/server";
import { pushSubscriptionSchema } from "@/lib/validators/forms";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/services/auth-service";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = pushSubscriptionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid subscription payload" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    await supabase.from("push_subscribers").upsert(
      {
        user_id: user?.id || null,
        one_signal_subscription_id: parsed.data.subscriptionId,
        status: parsed.data.optedIn ? "subscribed" : "unsubscribed"
      },
      { onConflict: "one_signal_subscription_id" }
    );
  }

  return NextResponse.json({ success: true });
}
