import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validators/forms";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/services/email-service";
import { welcomeTemplate } from "@/lib/emails/templates";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (supabase) {
    await supabase.from("newsletter_subscribers").upsert(
      {
        email: parsed.data.email,
        status: "subscribed"
      },
      { onConflict: "email" }
    );
  }

  const welcome = welcomeTemplate();
  await sendTransactionalEmail({
    to: parsed.data.email,
    subject: welcome.subject,
    html: welcome.html
  });

  return NextResponse.json({ success: true });
}
