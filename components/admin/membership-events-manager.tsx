"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MembershipEventsManager() {
  const [membershipId, setMembershipId] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("active");
  const [eventId, setEventId] = useState("event-private-lounge");
  const [eventTitle, setEventTitle] = useState("Private Lounge Night");
  const [status, setStatus] = useState<string | null>(null);

  const updateMembership = async () => {
    const response = await fetch("/api/admin/memberships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membershipId,
        status: membershipStatus
      })
    });

    setStatus(response.ok ? "Membership updated." : "Unable to update membership.");
  };

  const createEvent = async () => {
    const slug = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const response = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: eventId,
        title: eventTitle,
        slug,
        description: "Admin-created private event.",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
        location: "YISOS Lounge",
        capacity: 80,
        ticketPrice: 120
      })
    });

    setStatus(response.ok ? "Event saved." : "Unable to save event.");
  };

  return (
    <div className="mt-6 grid gap-5 rounded-xl border border-border bg-yisos-charcoal/70 p-5 md:grid-cols-2">
      <div className="space-y-2">
        <p className="font-semibold text-yisos-bone">Membership Management</p>
        <Label>Membership ID</Label>
        <Input value={membershipId} onChange={(e) => setMembershipId(e.target.value)} />
        <Label>Status</Label>
        <Input value={membershipStatus} onChange={(e) => setMembershipStatus(e.target.value)} />
        <Button variant="outline" onClick={updateMembership}>
          Save Membership
        </Button>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-yisos-bone">Events Management</p>
        <Label>Event ID</Label>
        <Input value={eventId} onChange={(e) => setEventId(e.target.value)} />
        <Label>Event Title</Label>
        <Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
        <Button variant="outline" onClick={createEvent}>
          Save Event
        </Button>
      </div>

      {status ? <p className="text-sm text-muted-foreground md:col-span-2">{status}</p> : null}
    </div>
  );
}
