"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AccountNotificationsPage() {
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [orderUpdatesOptIn, setOrderUpdatesOptIn] = useState(true);
  const [pushOptIn, setPushOptIn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    const response = await fetch("/api/account/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marketingOptIn, orderUpdatesOptIn, pushOptIn })
    });

    setMessage(response.ok ? "Preferences updated." : "Unable to save preferences.");
  };

  return (
    <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-6">
      <h1 className="font-display text-4xl text-yisos-bone">Notification Preferences</h1>
      <div className="mt-6 space-y-3 text-sm">
        <label className="flex items-center justify-between rounded-md border border-border p-3">
          Marketing emails
          <input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between rounded-md border border-border p-3">
          Order updates by email
          <input
            type="checkbox"
            checked={orderUpdatesOptIn}
            onChange={(e) => setOrderUpdatesOptIn(e.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between rounded-md border border-border p-3">
          Push notifications
          <input type="checkbox" checked={pushOptIn} onChange={(e) => setPushOptIn(e.target.checked)} />
        </label>
      </div>
      <Button className="mt-5" variant="luxury" onClick={save}>
        Save Preferences
      </Button>
      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
