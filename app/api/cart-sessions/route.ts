import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const SESSION_COOKIE = "yisos_cart_session";

function generateSessionId() {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({}));
  const cartItems = Array.isArray(json.items) ? json.items : [];

  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    sessionId = generateSessionId();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });
  }

  const supabase = getSupabaseAdminClient();

  if (supabase) {
    await supabase.from("cart_sessions").upsert(
      {
        id: sessionId,
        cart_data: cartItems,
        status: cartItems.length ? "active" : "empty",
        updated_at: new Date().toISOString()
      },
      { onConflict: "id" }
    );
  }

  return NextResponse.json({ success: true, sessionId });
}
