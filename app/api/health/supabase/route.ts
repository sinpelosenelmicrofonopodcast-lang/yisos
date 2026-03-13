import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const envConfigured = isSupabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!envConfigured) {
    return NextResponse.json(
      {
        ok: false,
        envConfigured: false,
        databaseReachable: false,
        storageConfigured: false,
        message: "Supabase env vars are missing"
      },
      { status: 503 }
    );
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        envConfigured: true,
        databaseReachable: false,
        storageConfigured: false,
        message: "Supabase admin client could not be created"
      },
      { status: 503 }
    );
  }

  const [{ error: settingsError }, { data: buckets, error: bucketError }] = await Promise.all([
    supabase.from("site_settings").select("key").limit(1),
    supabase.storage.listBuckets()
  ]);

  const storageConfigured =
    !bucketError && (buckets || []).some((bucket) => bucket.name === "product-images");

  return NextResponse.json(
    {
      ok: !settingsError,
      envConfigured: true,
      databaseReachable: !settingsError,
      storageConfigured,
      buckets: (buckets || []).map((bucket) => bucket.name)
    },
    { status: settingsError ? 503 : 200 }
  );
}
