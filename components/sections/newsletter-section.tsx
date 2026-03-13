"use client";

import { useState } from "react";
import { Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("Submitting...");

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      setStatus("Unable to subscribe right now.");
      return;
    }

    setEmail("");
    setStatus("You are in. Watch your inbox for premium drops.");
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 md:px-8">
      <div className="surface-2 rounded-2xl border border-border/85 p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.28em] text-yisos-gold">VIP Drop Alerts</p>
        <h3 className="mt-3 font-display text-4xl text-yisos-bone">Know The Drop Before The Room Does</h3>
        <p className="mt-3 max-w-2xl text-sm text-yisos-bone/80">
          Get release countdowns, members-first announcements, event invitations, and limited blend reminders by email and push.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["Limited editions", "VIP invites", "Members-first drops", "Private event alerts"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-border/70 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-yisos-bone/75"
            >
              {item}
            </span>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="luxury" size="lg">
            Subscribe
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => window.OneSignal?.Slidedown?.promptPush()}>
            <Bell className="mr-2 h-4 w-4" /> Enable Push
          </Button>
        </form>

        {status ? <p className="mt-3 text-sm text-yisos-bone/80">{status}</p> : null}
      </div>
    </section>
  );
}
