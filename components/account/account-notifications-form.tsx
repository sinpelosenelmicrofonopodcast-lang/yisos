"use client";

import { useState } from "react";
import { BellRing, Mail, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccountNotificationsFormProps {
  initialMarketingOptIn: boolean;
  initialOrderUpdatesOptIn: boolean;
  initialPushOptIn: boolean;
}

function PreferenceCard({
  title,
  description,
  active,
  onToggle,
  icon: Icon
}: {
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  icon: typeof Mail;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start justify-between gap-4 rounded-[1.2rem] border p-4 text-left transition",
        active
          ? "border-yisos-gold/45 bg-yisos-gold/10"
          : "border-border bg-black/20 hover:border-border/80 hover:bg-black/30"
      )}
    >
      <div className="flex gap-3">
        <div className="rounded-full border border-yisos-gold/25 bg-black/25 p-2">
          <Icon className="h-4 w-4 text-yisos-gold" />
        </div>
        <div>
          <p className="font-medium text-yisos-bone">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div
        className={cn(
          "mt-1 h-6 w-11 rounded-full border p-0.5 transition",
          active ? "border-yisos-gold bg-yisos-gold/30" : "border-border bg-white/10"
        )}
      >
        <div className={cn("h-5 w-5 rounded-full bg-yisos-bone transition", active ? "translate-x-5" : "translate-x-0")} />
      </div>
    </button>
  );
}

export function AccountNotificationsForm({
  initialMarketingOptIn,
  initialOrderUpdatesOptIn,
  initialPushOptIn
}: AccountNotificationsFormProps) {
  const [marketingOptIn, setMarketingOptIn] = useState(initialMarketingOptIn);
  const [orderUpdatesOptIn, setOrderUpdatesOptIn] = useState(initialOrderUpdatesOptIn);
  const [pushOptIn, setPushOptIn] = useState(initialPushOptIn);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/account/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketingOptIn, orderUpdatesOptIn, pushOptIn })
      });

      setMessage(response.ok ? "Preferences updated." : "Unable to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-border bg-[linear-gradient(145deg,rgba(31,26,22,0.95),rgba(10,10,10,0.98))] p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-yisos-gold">Alerts</p>
        <h1 className="mt-3 font-display text-4xl text-yisos-bone">Notification Preferences</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Decide which YISOS updates deserve your attention. Keep order status operational, and control how aggressive marketing and drop alerts should be.
        </p>
      </div>

      <div className="space-y-3">
        <PreferenceCard
          title="Marketing emails"
          description="Release announcements, gift moments, VIP offers, and occasional lounge updates."
          active={marketingOptIn}
          onToggle={() => setMarketingOptIn((current) => !current)}
          icon={Mail}
        />
        <PreferenceCard
          title="Order updates by email"
          description="Keep payment, packing, shipping, and fulfillment updates enabled for operational visibility."
          active={orderUpdatesOptIn}
          onToggle={() => setOrderUpdatesOptIn((current) => !current)}
          icon={PackageCheck}
        />
        <PreferenceCard
          title="Push notifications"
          description="Best for limited drops, restocks, and event invitations when timing matters."
          active={pushOptIn}
          onToggle={() => setPushOptIn((current) => !current)}
          icon={BellRing}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="luxury" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </div>
    </div>
  );
}
