import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function PATCH(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    membershipId?: string;
    status?: "active" | "paused" | "canceled";
    tier?: string;
  } | null;

  if (!body?.membershipId) {
    return NextResponse.json({ message: "membershipId is required" }, { status: 400 });
  }

  const { error } = await admin.supabase
    .from("memberships")
    .update({ status: body.status, tier: body.tier })
    .eq("id", body.membershipId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
