"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CommerceManager() {
  const [promoCode, setPromoCode] = useState("VIP15");
  const [promoDiscount, setPromoDiscount] = useState("15");
  const [giftCode, setGiftCode] = useState("GIFT-150-YISOS");
  const [giftAmount, setGiftAmount] = useState("150");
  const [reviewId, setReviewId] = useState("");
  const [reviewStatus, setReviewStatus] = useState("approved");
  const [status, setStatus] = useState<string | null>(null);

  const createPromo = async () => {
    const response = await fetch("/api/admin/promo-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: promoCode,
        discountType: "percent",
        discountValue: Number(promoDiscount),
        minimumSubtotal: 80,
        description: "Admin-created promo"
      })
    });

    setStatus(response.ok ? "Promo code saved." : "Unable to save promo code.");
  };

  const createGiftCard = async () => {
    const response = await fetch("/api/admin/gift-cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: giftCode,
        amount: Number(giftAmount)
      })
    });

    setStatus(response.ok ? "Gift card saved." : "Unable to save gift card.");
  };

  const moderateReview = async () => {
    const response = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewId,
        status: reviewStatus
      })
    });

    setStatus(response.ok ? "Review updated." : "Unable to update review.");
  };

  return (
    <div className="mt-6 grid gap-5 rounded-xl border border-border bg-yisos-charcoal/70 p-5 md:grid-cols-3">
      <div className="space-y-2">
        <p className="font-semibold text-yisos-bone">Promo Codes</p>
        <Label>Code</Label>
        <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
        <Label>Discount %</Label>
        <Input value={promoDiscount} onChange={(e) => setPromoDiscount(e.target.value)} type="number" />
        <Button variant="outline" onClick={createPromo}>
          Save Promo
        </Button>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-yisos-bone">Gift Cards</p>
        <Label>Code</Label>
        <Input value={giftCode} onChange={(e) => setGiftCode(e.target.value)} />
        <Label>Amount</Label>
        <Input value={giftAmount} onChange={(e) => setGiftAmount(e.target.value)} type="number" />
        <Button variant="outline" onClick={createGiftCard}>
          Save Gift Card
        </Button>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-yisos-bone">Review Moderation</p>
        <Label>Review ID</Label>
        <Input value={reviewId} onChange={(e) => setReviewId(e.target.value)} />
        <Label>Status</Label>
        <Input value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)} />
        <Button variant="outline" onClick={moderateReview}>
          Save Review
        </Button>
      </div>

      {status ? <p className="text-sm text-muted-foreground md:col-span-3">{status}</p> : null}
    </div>
  );
}
