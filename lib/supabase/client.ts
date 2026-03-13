"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return null;
  }

  return createBrowserClient<Database>(url, anon);
}
