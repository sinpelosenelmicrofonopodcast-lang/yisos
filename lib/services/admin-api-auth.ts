import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function assertAdmin() {
  const user = await getCurrentUser();
  const supabase = getSupabaseAdminClient();

  if (!user || !supabase) {
    return { ok: false as const, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { ok: false as const, response: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const, supabase, user };
}
