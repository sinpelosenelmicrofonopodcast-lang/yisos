import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";
import { welcomeTemplate } from "@/lib/emails/templates";
import { sendTransactionalEmail } from "@/lib/services/email-service";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as { to?: string } | null;

  if (!body?.to) {
    return NextResponse.json({ message: "Recipient email required" }, { status: 400 });
  }

  const tpl = welcomeTemplate("Member");
  const result = await sendTransactionalEmail({
    to: body.to,
    subject: `[Test] ${tpl.subject}`,
    html: tpl.html
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
