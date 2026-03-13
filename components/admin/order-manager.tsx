"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OrderManager() {
  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("processing");
  const [status, setStatus] = useState<string | null>(null);

  const submit = async () => {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, paymentStatus, fulfillmentStatus })
    });

    setStatus(response.ok ? "Order updated." : "Unable to update order.");
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-yisos-charcoal/70 p-5">
      <p className="font-semibold text-yisos-bone">Update Order Status</p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <Label>Order ID</Label>
          <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Payment Status</Label>
          <Input value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Fulfillment Status</Label>
          <Input value={fulfillmentStatus} onChange={(e) => setFulfillmentStatus(e.target.value)} />
        </div>
      </div>
      <Button className="mt-4" variant="luxury" onClick={submit}>
        Save Status
      </Button>
      {status ? <p className="mt-2 text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
