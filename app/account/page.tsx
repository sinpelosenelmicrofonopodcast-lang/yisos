import { AccountSignin } from "@/components/account/account-signin";
import { AccountProfileBootstrap } from "@/components/account/account-profile-bootstrap";
import { AccountSignout } from "@/components/account/account-signout";
import { getCurrentUser, getUserProfile } from "@/lib/services/auth-service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BellRing, Heart, Package, ShieldCheck, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  const profile = user ? await getUserProfile(user.id) : null;

  if (!user) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <AccountSignin />
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(160deg,rgba(27,23,20,0.95),rgba(10,10,10,0.98))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.28em] text-yisos-gold">Private Access</p>
          <h2 className="mt-3 font-display text-3xl text-yisos-bone">Member Account</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Access your order history, saved favorites, shipping addresses, and notification preferences.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-yisos-bone/76">
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">
              <p className="font-medium text-yisos-bone">Fast sign in, real account ownership</p>
              <p className="mt-2 text-muted-foreground">Use email and password, Google OAuth, or magic link when you need a no-password fallback.</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">
              <p className="font-medium text-yisos-bone">Your lounge utility, not a throwaway login</p>
              <p className="mt-2 text-muted-foreground">Membership status, concierge access, drop alerts, and future lounge perks all live here.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { href: "/account/orders", label: "Orders", description: "Track payments, shipping, and fulfillment.", icon: Package },
    { href: "/account/favorites", label: "Favorites", description: "Keep a shortlist of blends worth revisiting.", icon: Heart },
    { href: "/account/notifications", label: "Notifications", description: "Control drop alerts, emails, and push updates.", icon: BellRing }
  ];

  return (
    <div className="space-y-6">
      <AccountProfileBootstrap />
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-[linear-gradient(135deg,rgba(31,26,22,0.95),rgba(10,10,10,0.98)),radial-gradient(circle_at_top_right,rgba(200,148,52,0.15),transparent_28%)] p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-yisos-gold">Welcome Back</p>
            <h1 className="mt-2 font-display text-4xl text-yisos-bone md:text-5xl">{profile?.full_name || user.email}</h1>
            <p className="mt-3 text-sm leading-relaxed text-yisos-bone/72">
              Account opened {formatDate(user.created_at)}. Keep favorites close, review past orders, and stay in position for the next private drop.
            </p>
          </div>
          <div className="rounded-2xl border border-yisos-gold/25 bg-black/20 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-yisos-gold">Membership</p>
            <p className="mt-2 font-display text-2xl text-yisos-bone">{profile?.membership_tier || "Not enrolled"}</p>
            <p className="mt-2 text-sm text-muted-foreground">Upgrade when you want early access, private offers, and concierge ordering.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="luxury">
            <Link href="/membership">Explore Membership</Link>
          </Button>
          {profile?.role === "admin" ? (
            <Button asChild variant="luxury">
              <Link href="/admin">Open Admin Dashboard</Link>
            </Button>
          ) : null}
          <AccountSignout />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-[1.35rem] border border-border bg-yisos-charcoal/75 p-5 transition hover:-translate-y-1 hover:border-yisos-gold/35"
          >
            <link.icon className="h-5 w-5 text-yisos-gold" />
            <p className="mt-4 font-display text-2xl text-yisos-bone">{link.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{link.description}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
        <div className="rounded-[1.5rem] border border-border bg-yisos-charcoal/75 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-yisos-gold" />
            <p className="font-display text-2xl text-yisos-bone">Account Snapshot</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Email</p>
              <p className="mt-2 text-sm text-yisos-bone">{profile?.email || user.email}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Adult Verification</p>
              <p className="mt-2 text-sm text-yisos-bone">{profile?.date_of_birth ? "Date on file" : "Stored during signup"}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Marketing Emails</p>
              <p className="mt-2 text-sm text-yisos-bone">{profile?.marketing_opt_in ? "Subscribed" : "Paused"}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-yisos-gold">Push Alerts</p>
              <p className="mt-2 text-sm text-yisos-bone">{profile?.push_opt_in ? "Enabled" : "Not enabled"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-yisos-charcoal/75 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-yisos-gold" />
            <p className="font-display text-2xl text-yisos-bone">VIP Cellar Path</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Members get earlier drop access, private offers, and better positioning for limited releases.
          </p>
          <div className="mt-5 space-y-3 text-sm text-yisos-bone/76">
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">Early drop access and allocation priority</div>
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">Concierge-style recommendations for gifts and events</div>
            <div className="rounded-xl border border-border/70 bg-black/20 p-4">Priority event invites and release notifications</div>
          </div>
        </div>
      </div>
    </div>
  );
}
