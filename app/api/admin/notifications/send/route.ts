import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";
import { sendOneSignalNotification } from "@/lib/services/onesignal-service";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const payload = await request.json().catch(() => null);
  const title = String(payload?.title || "YISOS CIGARS");
  const message = String(payload?.message || "New update from YISOS");

  const result = await sendOneSignalNotification({
    headings: { en: title },
    contents: { en: message },
    includedSegments: payload?.segment ? [String(payload.segment)] : ["Subscribed Users"]
  });

  await admin.supabase.from("admin_logs").insert({
    actor_user_id: admin.user.id,
    action: "send_notification",
    payload,
    status: result.ok ? "success" : "error"
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
