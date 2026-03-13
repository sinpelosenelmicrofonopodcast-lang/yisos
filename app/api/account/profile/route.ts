import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    fullName?: string;
    dateOfBirth?: string;
  } | null;

  const fullName = body?.fullName?.trim() || "";
  const dateOfBirth = body?.dateOfBirth || "";

  if (!fullName || !dateOfBirth) {
    return NextResponse.json({ message: "Full name and date of birth are required." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      date_of_birth: dateOfBirth
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
