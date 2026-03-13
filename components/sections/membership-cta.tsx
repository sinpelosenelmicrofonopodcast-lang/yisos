import Link from "next/link";
import { Crown, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MembershipCta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <div className="vault-sweep relative overflow-hidden rounded-[30px] border border-yisos-gold/40 bg-[radial-gradient(circle_at_top_right,rgba(200,148,52,0.18),transparent_28%),linear-gradient(135deg,#24130d_0%,#0f0c0b_52%,#4b5012_100%)] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-yisos-gold">VIP Cellar</p>
            <h3 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-yisos-bone md:text-5xl">
              A Private Vault For Early Drops, Members-Only Cigars, And Concierge Ordering
            </h3>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-yisos-black/30 px-4 py-2 text-yisos-bone/85">
                <Sparkles className="h-4 w-4 text-yisos-gold" /> Early access
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-yisos-black/30 px-4 py-2 text-yisos-bone/85">
                <Lock className="h-4 w-4 text-yisos-gold" /> Members-only cigars
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-yisos-black/30 px-4 py-2 text-yisos-bone/85">
                <ShieldCheck className="h-4 w-4 text-yisos-gold" /> Concierge ordering
              </span>
            </div>
            <div className="mt-8">
              <Button asChild variant="luxury" size="lg">
                <Link href="/membership">
                  <Crown className="mr-2 h-4 w-4" /> Join VIP Cellar
                </Link>
              </Button>
            </div>
          </div>

          <div className="surface-1 rounded-[24px] border border-yisos-gold/20 p-5">
            <div className="rounded-[20px] border border-border/80 bg-black/20 p-5">
              <div className="text-[10px] uppercase tracking-[0.28em] text-yisos-gold">Vault Access Card</div>
              <div className="mt-6 flex items-start justify-between">
                <div>
                  <div className="font-display text-3xl text-yisos-stitch">Black Label Reserve</div>
                  <div className="mt-2 text-sm text-yisos-bone/75">Private drops, event access, reserve pricing</div>
                </div>
                <div className="rounded-full border border-yisos-gold/30 p-3 text-yisos-gold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-border/80 bg-black/20 p-3">
                  <div className="font-display text-2xl text-yisos-stitch">72h</div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-yisos-bone/65">Early Access</div>
                </div>
                <div className="rounded-2xl border border-border/80 bg-black/20 p-3">
                  <div className="font-display text-2xl text-yisos-stitch">VIP</div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-yisos-bone/65">Event Invites</div>
                </div>
                <div className="rounded-2xl border border-border/80 bg-black/20 p-3">
                  <div className="font-display text-2xl text-yisos-stitch">1:1</div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-yisos-bone/65">Concierge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
