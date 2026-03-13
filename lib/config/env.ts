type RequiredVar = "SUPABASE_URL" | "SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_ROLE_KEY";

export function hasEnv(keys: string[]) {
  return keys.every((key) => Boolean(process.env[key]));
}

export function getEnv(name: RequiredVar) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function isSupabaseConfigured() {
  return hasEnv(["SUPABASE_URL", "SUPABASE_ANON_KEY"]);
}

export function isStripeConfigured() {
  return hasEnv(["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]);
}

export function isResendConfigured() {
  return hasEnv(["RESEND_API_KEY"]);
}

export function isOneSignalConfigured() {
  return hasEnv(["NEXT_PUBLIC_ONESIGNAL_APP_ID"]);
}
