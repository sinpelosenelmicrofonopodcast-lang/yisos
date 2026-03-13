import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  full_name: string | null;
  role: "customer" | "admin";
  membership_tier: string | null;
  marketing_opt_in: boolean;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/account?signin=1");
  }
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, membership_tier, marketing_opt_in")
    .eq("id", userId)
    .maybeSingle();

  return (data as unknown as UserProfile | null) ?? null;
}

export async function requireAdmin() {
  const user = await requireUser();
  const profile = await getUserProfile(user.id);

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return { user, profile };
}
