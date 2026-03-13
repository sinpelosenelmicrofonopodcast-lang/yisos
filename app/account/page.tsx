import { AccountSignin } from "@/components/account/account-signin";
import { AccountProfileBootstrap } from "@/components/account/account-profile-bootstrap";
import { AccountSignout } from "@/components/account/account-signout";
import { getCurrentUser, getUserProfile } from "@/lib/services/auth-service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  const profile = user ? await getUserProfile(user.id) : null;

  if (!user) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <AccountSignin />
        <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-6">
          <h2 className="font-display text-3xl text-yisos-bone">Member Account</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Access your order history, saved favorites, shipping addresses, and notification preferences.
          </p>
          <div className="mt-6 space-y-3 text-sm text-yisos-bone/76">
            <p>Create your account with email and password, or use Google for faster access.</p>
            <p>Magic link is still available as a secondary fallback when you do not want to enter your password.</p>
            <p>VIP membership status and concierge benefits appear here once enrolled.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AccountProfileBootstrap />
      <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-yisos-gold">Welcome Back</p>
        <h1 className="mt-2 font-display text-4xl text-yisos-bone">{profile?.full_name || user.email}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Membership: {profile?.membership_tier || "Not enrolled"}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {profile?.role === "admin" ? (
            <Button asChild variant="luxury">
              <Link href="/admin">Open Admin Dashboard</Link>
            </Button>
          ) : null}
          <AccountSignout />
        </div>
      </div>
    </div>
  );
}
