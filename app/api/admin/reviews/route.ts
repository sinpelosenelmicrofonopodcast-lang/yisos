import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/services/admin-api-auth";

export async function PATCH(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.response;

  const body = (await request.json().catch(() => null)) as {
    reviewId?: string;
    status?: "approved" | "rejected" | "pending";
  } | null;

  if (!body?.reviewId || !body.status) {
    return NextResponse.json({ message: "reviewId and status are required" }, { status: 400 });
  }

  const { error } = await admin.supabase.from("reviews").update({ status: body.status }).eq("id", body.reviewId);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
