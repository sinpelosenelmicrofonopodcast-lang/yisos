import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    code?: string;
    amount?: number;
    email?: string;
    expiresAt?: string;
  } | null;

  if (!body?.code || body.amount === undefined) {
    return NextResponse.json({ message: "code and amount are required" }, { status: 400 });
  }

  const { error } = await admin.supabase.from("gift_cards").upsert(
    {
      code: body.code.toUpperCase(),
      initial_amount: Number(body.amount),
      balance: Number(body.amount),
      issued_to_email: body.email || null,
      expires_at: body.expiresAt || null,
      is_active: true
    },
    { onConflict: "code" }
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
