import { buildMetadata } from "@/lib/seo/metadata";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { getMembershipTiers } from "@/lib/services/site-settings-service";

export const metadata = buildMetadata({
  title: "Membership",
  description: "Join the YISOS VIP club for early drops, events, and private pricing.",
  path: "/membership"
});

export default async function MembershipPage() {
  const membershipTiers = await getMembershipTiers();

  return (
    <>
      <PageHero
        eyebrow="VIP"
        title="YISOS Membership"
        description="Access the private cellar with member-only pricing, invitations, and first-look allocations."
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
        {membershipTiers.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {membershipTiers.map((tier) => (
              <article key={tier.id} className="rounded-2xl border border-border bg-yisos-charcoal/70 p-8">
                <p className="text-xs uppercase tracking-[0.26em] text-yisos-gold">Membership Tier</p>
                <h2 className="mt-2 font-display text-4xl text-yisos-bone">{tier.name}</h2>
                <p className="mt-2 text-muted-foreground">
                  ${tier.monthlyPrice}/month or ${tier.annualPrice}/year
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  {tier.perks.map((perk) => (
                    <li key={perk}>• {perk}</li>
                  ))}
                </ul>
                <Button className="mt-8" variant="luxury" size="lg">
                  Request Invitation
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface-1 rounded-2xl border border-border p-8 text-sm text-yisos-bone/78">
            Membership tiers have not been configured in Supabase yet.
          </div>
        )}
      </section>
    </>
  );
}
