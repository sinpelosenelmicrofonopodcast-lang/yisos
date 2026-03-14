import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "customer" | "admin";
  membership_tier: string | null;
  marketing_opt_in: boolean;
  order_updates_opt_in: boolean;
  push_opt_in: boolean;
  date_of_birth: string | null;
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
    .select("id, email, full_name, role, membership_tier, marketing_opt_in, order_updates_opt_in, push_opt_in, date_of_birth")
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
