"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("New Limited Drop");
  const [message, setMessage] = useState("A private release is now live for members.");
  const [segment, setSegment] = useState("Subscribed Users");
  const [status, setStatus] = useState<string | null>(null);

  const send = async () => {
    const response = await fetch("/api/admin/notifications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message, segment })
    });

    const data = await response.json().catch(() => ({}));
    setStatus(response.ok ? "Campaign sent." : data.message || "Unable to send campaign.");
  };

  return (
    <div className="rounded-xl border border-border bg-yisos-charcoal/70 p-6">
      <h1 className="font-display text-4xl text-yisos-bone">Push Campaigns</h1>
      <p className="mt-2 text-sm text-muted-foreground">Send OneSignal campaigns for launches, promotions, and event announcements.</p>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="segment">Segment</Label>
          <Input id="segment" value={segment} onChange={(event) => setSegment(event.target.value)} />
        </div>
      </div>

      <Button className="mt-6" variant="luxury" onClick={send}>
        Send Notification
      </Button>
      {status ? <p className="mt-3 text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
