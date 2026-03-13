import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/services/email-service";
import { abandonedCartTemplate } from "@/lib/emails/templates";

interface CartSessionRow {
  id: string;
  user_id: string | null;
  cart_data: unknown;
}

interface ProfileEmailRow {
  email: string | null;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ message: "Supabase not configured" }, { status: 500 });
  }

  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString();

  const { data } = await supabase
    .from("cart_sessions")
    .select("id, user_id, cart_data")
    .lt("updated_at", cutoff)
    .eq("status", "active")
    .limit(100);

  let sent = 0;

  for (const session of (data as CartSessionRow[] | null) || []) {
    if (!session.user_id || !Array.isArray(session.cart_data) || session.cart_data.length === 0) continue;

    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", session.user_id)
      .maybeSingle();

    const typedProfile = profile as ProfileEmailRow | null;
    if (!typedProfile?.email) continue;

    const tpl = abandonedCartTemplate(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart`);
    const result = await sendTransactionalEmail({
      to: typedProfile.email,
      subject: tpl.subject,
      html: tpl.html
    });

    if (result.ok) {
      sent += 1;
      await supabase.from("cart_sessions").update({ status: "recovery_sent" }).eq("id", session.id);
    }
  }

  return NextResponse.json({ success: true, sent });
}
