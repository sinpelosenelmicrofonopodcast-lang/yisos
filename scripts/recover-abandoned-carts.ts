import { createClient } from "@supabase/supabase-js";
import { sendTransactionalEmail } from "../lib/services/email-service";
import { abandonedCartTemplate } from "../lib/emails/templates";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase env vars");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString();

  const { data, error } = await supabase
    .from("cart_sessions")
    .select("id, user_id, cart_data, updated_at")
    .lt("updated_at", cutoff)
    .eq("status", "active")
    .limit(100);

  if (error) throw error;

  for (const session of data || []) {
    if (!session.user_id || !Array.isArray(session.cart_data) || session.cart_data.length === 0) {
      continue;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", session.user_id)
      .maybeSingle();

    if (!profile?.email) {
      continue;
    }

    const tpl = abandonedCartTemplate(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart`);
    await sendTransactionalEmail({
      to: profile.email,
      subject: tpl.subject,
      html: tpl.html
    });

    await supabase
      .from("cart_sessions")
      .update({ status: "recovery_sent" })
      .eq("id", session.id);
  }

  console.log(`Processed ${data?.length || 0} abandoned carts.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
