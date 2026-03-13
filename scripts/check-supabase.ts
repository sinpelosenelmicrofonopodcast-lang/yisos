import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  const [{ error: dbError }, { data: buckets, error: bucketError }] = await Promise.all([
    supabase.from("site_settings").select("key").limit(1),
    supabase.storage.listBuckets()
  ]);

  console.log(
    JSON.stringify(
      {
        ok: !dbError,
        databaseReachable: !dbError,
        dbError: dbError?.message || null,
        storageReachable: !bucketError,
        storageError: bucketError?.message || null,
        buckets: (buckets || []).map((bucket) => bucket.name)
      },
      null,
      2
    )
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
