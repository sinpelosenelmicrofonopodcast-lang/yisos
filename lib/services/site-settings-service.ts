import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MembershipTier } from "@/types";

interface SiteSettingRow {
  key: string;
  value: unknown;
}

function isMembershipTierArray(value: unknown): value is MembershipTier[] {
  return Array.isArray(value);
}

export async function getMembershipTiers(): Promise<MembershipTier[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .eq("key", "membership_tiers")
    .maybeSingle();

  if (error || !data) {
    return [];
  }

  const setting = data as unknown as SiteSettingRow;
  return isMembershipTierArray(setting.value) ? setting.value : [];
}
